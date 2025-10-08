"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Department, {
        foreignKey: "departmentId",
      });

      User.hasMany(models.Berita_Acara, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "name is required" },
          notNull: { msg: "name is required" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { msg: "email must be valid" },
          notEmpty: { msg: "email is required" },
          notNull: { msg: "email is required" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "password is required" },
          notNull: { msg: "password is required" },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
        validate: {
          notEmpty: { msg: "role is required" },
          notNull: { msg: "role is required" },
        },
      },
      departmentId: {
        type: DataTypes.STRING,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      hooks: {
        beforeCreate: (user) => {
          user.password = bcrypt.hashSync(user.password, 10);
        },
        beforeUpdate: (user) => {
          if (user.changed("password")) {
            user.password = bcrypt.hashSync(user.password, 10);
          }
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
