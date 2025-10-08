"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Berita_Acara extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Berita_Acara.hasMany(models.Berita_Acara_Periode, {
        foreignKey: "berita_acara_id",
        onDelete: "CASCADE",
      });

      Berita_Acara.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
    }
  }
  Berita_Acara.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tipe_transaksi: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Tipe transaksi is required" },
          notEmpty: { msg: "Tipe transaksi is required" },
        },
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "User Id is required" },
          notEmpty: { msg: "User Id is required" },
        },
      },
      number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Nomor berita acara is required" },
          notEmpty: { msg: "Nomor berita acara is required" },
        },
      },
      site: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Site is required" },
          notEmpty: { msg: "Site is required" },
        },
      },
      customer_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Customer ID is required" },
          notEmpty: { msg: "Customer ID is required" },
        },
      },
      periode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Periode is required" },
          notEmpty: { msg: "Periode is required" },
        },
      },
      cut_off: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Cut off is required" },
          notEmpty: { msg: "Cut off is required" },
        },
      },
      tipe_customer: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Tipe customer is required" },
          notEmpty: { msg: "Tipe customer is required" },
        },
      },
      type_of_work_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Type of work ID is required" },
          notEmpty: { msg: "Type of work ID is required" },
        },
      },
      reguler: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Reguler is required" },
          notEmpty: { msg: "Reguler is required" },
        },
      },
      pic: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "PIC is required" },
          notEmpty: { msg: "PIC is required" },
        },
      },
      submitted_at: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Submitted date is required" },
          notEmpty: { msg: "Submitted date is required" },
        },
      },
      goods_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      satuan_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nill_ditagihkan: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Nilai ditagihkan is required" },
          notEmpty: { msg: "Nilai ditagihkan is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Berita_Acara",
    }
  );
  return Berita_Acara;
};
