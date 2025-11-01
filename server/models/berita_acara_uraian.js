"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Berita_Acara_Uraian extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Berita_Acara_Uraian.belongsTo(models.Berita_Acara, {
        foreignKey: "berita_acara_id",
        as: "berita_acara",
      });
    }
  }
  Berita_Acara_Uraian.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      berita_acara_id: DataTypes.UUIDV4,
      goods_id: DataTypes.UUIDV4,
      satuan: DataTypes.STRING,
      quantity: DataTypes.STRING,
      harga: DataTypes.STRING,
      total: DataTypes.STRING,
      dpp_nilai_lain_of: DataTypes.STRING,
      jumlah_ppn_of: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Berita_Acara_Uraian",
    }
  );
  return Berita_Acara_Uraian;
};
