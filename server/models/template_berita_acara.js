"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Template_Berita_Acara extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Template_Berita_Acara.belongsTo(models.Berita_Acara, {
        foreignKey: "berita_acara_id",
      });
      Template_Berita_Acara.belongsTo(models.Template, {
        foreignKey: "template_id",
      });
    }
  }
  Template_Berita_Acara.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      berita_acara_id: {
        type: DataTypes.UUID,
      },
      template_id: {
        type: DataTypes.UUID,
      },
      html_rendered: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Template_Berita_Acara",
    }
  );
  return Template_Berita_Acara;
};
