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
      ppn_of: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      range_periode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Faktur",
    }
  );
  return Faktur;
};
