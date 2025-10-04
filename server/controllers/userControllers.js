const { Op } = require("sequelize");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

class UserController {
  static async createUser(req, res) {
    try {
      const { name, email, password, role, department } = req.body;

      // 1. validate unique email
      const validateEmail = await User.findOne({ where: { email } });
      if (validateEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // 2. validate length of password
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      // 3. create account
      const newUser = await User.create({
        name,
        email,
        password,
        role,
        department,
      });

      // 4. response without password
      const responseWithoutPassword = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
      };

      res.status(201).json(responseWithoutPassword);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      // 1. validasi form
      if (!email)
        return res.status(400).json({ message: "Please enter your email" });
      if (!password)
        return res.status(400).json({ message: "Please enter your password" });

      // 2. cari user
      let findUser = await User.findOne({ where: { email } });
      if (!findUser)
        return res.status(401).json({ message: "Invalid email/password" });

      // 3. verify password
      let checkPassword = comparePassword(password, findUser.password);
      if (!checkPassword)
        return res.status(401).json({ message: "Invalid email/password" });

      let access_token = signToken({
        id: findUser.id,
        email: findUser.email,
        role: findUser.role,
      });

      res.status(200).json({
        data: {
          access_token: access_token,
          role: findUser.role,
        },
      });
    } catch (error) {
      console.log(error);
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async profile(req, res) {
    try {
      const { role, name, email, department } = req.user;

      res.status(200).json({ role, name, email, department });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { role, name, email, department } = req.body;

      if (req.user.role === "superadmin") {
        await User.update(
          {
            role,
            name,
            email,
            department,
          },
          {
            where: {
              id: req.user.id,
            },
          }
        );
        res.status(200).json({ role, name, email, department });
      }

      if (req.user.role === "user") {
        await User.update(
          {
            name,
            email,
          },
          {
            where: {
              id: req.user.id,
            },
          }
        );
        res.status(200).json({ name, email });
      }
    } catch (error) {
      console.log(error);
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteProfile(req, res) {
    try {
      await User.destroy({
        where: {
          id: req.user.id,
        },
      });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Department,
            as: "department",
            attributes: ["name"],
          },
        ],
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async changePassword(req, res) {
    try {
      const { current, new: newPassword, confirm } = req.body;

      if (!current || !newPassword || !confirm) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = comparePassword(current, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "New password must be at least 6 characters" });
      }

      if (newPassword !== confirm) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const { hashPassword } = require("../helpers/bcrypt");
      const hashedPassword = hashPassword(newPassword);

      await User.update(
        { password: hashedPassword },
        { where: { id: req.user.id } }
      );

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = UserController;
