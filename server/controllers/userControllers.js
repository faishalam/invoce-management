const { Op } = require("sequelize");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User, Department } = require("../models");

class UserController {
  static async createUser(req, res) {
    try {
      const { name, email, password, role, department_id } = req.body;

      // 1. validate unique email
      const validateEmail = await User.findOne({ where: { email } });
      if (validateEmail) {
        return res.status(400).json({
          status: "error",
          message: "Email already exists",
          data: null,
        });
      }

      // 2. validate length of password
      if (password.length < 6) {
        return res.status(400).json({
          status: "error",
          message: "Password must be at least 6 characters",
          data: null,
        });
      }

      // 3. create account
      const newUser = await User.create({
        name,
        email,
        password,
        role,
        department_id,
      });

      // 4. response without password
      const responseWithoutPassword = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department_id: newUser.department_id,
      };

      return res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: responseWithoutPassword,
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          status: "error",
          message: error.errors[0].message,
          data: null,
        });
      }
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        data: null,
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email)
        return res.status(400).json({
          status: "error",
          message: "Please enter your email",
          data: null,
        });

      if (!password)
        return res.status(400).json({
          status: "error",
          message: "Please enter your password",
          data: null,
        });

      const findUser = await User.findOne({ where: { email } });
      if (!findUser)
        return res.status(401).json({
          status: "error",
          message: "Invalid email/password",
          data: null,
        });

      const checkPassword = comparePassword(password, findUser.password);
      if (!checkPassword)
        return res.status(401).json({
          status: "error",
          message: "Invalid email/password",
          data: null,
        });

      const access_token = signToken({
        id: findUser.id,
        email: findUser.email,
        role: findUser.role,
      });

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          access_token,
          role: findUser.role,
        },
      });
    } catch (error) {
      console.log(error);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          status: "error",
          message: error.errors[0].message,
          data: null,
        });
      }
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        data: null,
      });
    }
  }

  static async profile(req, res) {
    try {
      const { role, name, email, department_id } = req.user;

      const findDepartment = await Department.findByPk(department_id);
      if (!findDepartment) {
        return res.status(404).json({
          status: "error",
          message: "Department not found",
          data: null,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "User profile fetched",
        data: { role, name, email, department: findDepartment.name },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
        data: null,
      });
    }
  }

  static async updateUser(req, res) {
    try {
      const { name, email } = req.body;
      const { id } = req.params;

      await User.update({ name, email }, { where: { id: id } });

      return res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: { name, email },
      });
    } catch (error) {
      console.log(error);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          status: "error",
          message: error.errors[0].message,
          data: null,
        });
      }
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        data: null,
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (req.user.role === "superadmin") {
        await User.destroy({ where: { id } });
        return res.status(200).json({
          status: "success",
          message: "User deleted successfully",
          data: null,
        });
      } else {
        return res.status(403).json({
          status: "error",
          message: "Unauthorized to delete user",
          data: null,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
        data: null,
      });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        order: [["createdAt", "DESC"]],
        attributes: { exclude: ["password"] },
      });

      return res.status(200).json({
        status: "success",
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
        data: null,
      });
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
          data: null,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "User fetched successfully",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
        data: null,
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { current, new: newPassword, confirm } = req.body;

      if (!current || !newPassword || !confirm) {
        return res.status(400).json({
          status: "error",
          message: "All fields are required",
          data: null,
        });
      }

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
          data: null,
        });
      }

      const isMatch = comparePassword(current, user.password);
      if (!isMatch) {
        return res.status(400).json({
          status: "error",
          message: "Current password is incorrect",
          data: null,
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          status: "error",
          message: "New password must be at least 6 characters",
          data: null,
        });
      }

      if (newPassword !== confirm) {
        return res.status(400).json({
          status: "error",
          message: "Passwords do not match",
          data: null,
        });
      }

      const { hashPassword } = require("../helpers/bcrypt");
      const hashedPassword = hashPassword(newPassword);

      await User.update(
        { password: hashedPassword },
        { where: { id: req.user.id } }
      );

      return res.status(200).json({
        status: "success",
        message: "Password changed successfully",
        data: null,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        data: null,
      });
    }
  }
}

module.exports = UserController;
