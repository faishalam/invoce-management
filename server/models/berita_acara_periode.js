"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Berita_Acara_Periode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Berita_Acara_Periode.belongsTo(models.Berita_Acara, {
        foreignKey: "berita_acara_id",
        onDelete: "CASCADE",
      });
    }
  }
  Berita_Acara_Periode.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      berita_acara_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Berita acara ID is required" },
          notEmpty: { msg: "Berita acara ID is required" },
        },
      },
      planAlokasiPeriode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Plan Alokasi Periode is required" },
          notEmpty: { msg: "Plan Alokasi Periode is required" },
        },
      },
      harga_per_liter: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Harga per liter is required" },
          notEmpty: { msg: "Harga per liter is required" },
        },
      },
      plan_liter: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Plan liter is required" },
          notEmpty: { msg: "Plan liter is required" },
        },
      },
      actual_liter: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Actual liter is required" },
          notEmpty: { msg: "Actual liter is required" },
        },
      },
      total_kelebihan: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Total kelebihan is required" },
          notEmpty: { msg: "Total kelebihan is required" },
        },
      },
      alokasi_backcharge: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Alokasi backcharge is required" },
          notEmpty: { msg: "Alokasi backcharge is required" },
        },
      },
      nilai_backcharge: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Nilai backcharge is required" },
          notEmpty: { msg: "Nilai backcharge is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Berita_Acara_Periode",
    }
  );
  return Berita_Acara_Periode;
};
