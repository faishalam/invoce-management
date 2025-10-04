const { Op } = require("sequelize");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

class UserController {
  static async createUser(req, res) {
    try {
      const { username, email, password, role } = req.body;

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
        username,
        email,
        password,
        role,
      });

      // 4. response without password
      const responseWithoutPassword = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
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

  static async getLoggedInUser(req, res) {
    try {
      const { role, username, email } = req.user;

      res.status(200).json({ role, username, email });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserController;
