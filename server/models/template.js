"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Template extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Template.hasMany(models.Template_Berita_Acara, {
        foreignKey: "template_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Template.hasMany(models.Template_Debit_Note, {
        foreignKey: "template_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Template.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: DataTypes.STRING,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Template",
    }
  );
  return Template;
};
