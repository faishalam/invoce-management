"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Faktur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Faktur.belongsTo(models.Berita_Acara, {
        foreignKey: "berita_acara_id",
        as: "berita_acara",
      });
      Faktur.belongsTo(models.Debit_Note, {
        foreignKey: "debit_note_id",
        as: "debit_note",
      });
    }
  }
  Faktur.init(
    {
      berita_acara_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Berita acara ID is required" },
          notEmpty: { msg: "Berita acara ID is required" },
        },
      },
      debit_note_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Berita acara ID is required" },
          notEmpty: { msg: "Berita acara ID is required" },
        },
      },
      nomor_seri_faktur: DataTypes.STRING,
      masa_pajak: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tahun: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      npwp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customer_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sub_total: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dpp_nilai_lain_fk: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ppn_fk: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jumlah_ppn_fk: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      kode_objek: DataTypes.STRING,
      uraian: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "Uraian list is required" },
          notEmpty: { msg: "Uraian list is required" },
          isArray(value) {
            if (!Array.isArray(value)) {
              throw new Error("Uraian must be an array of objects");
            }
            if (value.length === 0) {
              throw new Error("Uraian cannot be empty");
            }
            value.forEach((item, index) => {
              if (
                !item.uraian ||
                !item.satuan ||
                !item.volume ||
                !item.harga ||
                !item.jumlah ||
                !item.dpp_nilai_lain_of ||
                !item.jumlah_ppn_of
              ) {
                throw new Error(`Incomplete uraian data at index ${index}`);
              }
            });
          },
        },
      },
      ppn_of: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Faktur",
    }
  );
  return Faktur;
};
