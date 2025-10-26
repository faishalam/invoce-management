"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Debit_Note extends Model {
    static associate(models) {
      // define association here (jika nanti ada relasi ke tabel lain)
      Debit_Note.belongsTo(models.Berita_Acara, {
        foreignKey: "berita_acara_id",
        as: "berita_acara",
      });
      Debit_Note.hasOne(models.Faktur, {
        foreignKey: "debit_note_id",
        as: "faktur",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Debit_Note.hasOne(models.Template_Debit_Note, {
        foreignKey: "debit_note_id",
        as: "template_debit_note",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Debit_Note.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      berita_acara_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Berita acara ID is required" },
          notEmpty: { msg: "Berita acara ID is required" },
        },
      },
      debit_note_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Debit Note Number is required" },
          notEmpty: { msg: "Debit Note Number is required" },
        },
      },
      batas_akhir: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Due date is required" },
          notEmpty: { msg: "Due date is required" },
        },
      },
      uraian: {
        type: DataTypes.JSONB,
        allowNull: true,
        validate: {
          isArray(value) {
            if (value && !Array.isArray(value)) {
              throw new Error("Uraian must be an array of objects");
            }
          },
        },
      },
      sub_total: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Subtotal is required" },
          notEmpty: { msg: "Subtotal is required" },
        },
      },
      ppn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "PPN is required" },
          notEmpty: { msg: "PPN is required" },
        },
      },
      total: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Total amount is required" },
          notEmpty: { msg: "Total amount is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Debit_Note",
    }
  );

  return Debit_Note;
};
