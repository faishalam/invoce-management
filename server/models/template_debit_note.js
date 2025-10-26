"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Template_Debit_Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Template_Debit_Note.belongsTo(models.Debit_Note, {
        foreignKey: "debit_note_id",
        as: "debit_note",
      });
      Template_Debit_Note.belongsTo(models.Template, {
        foreignKey: "template_id",
      });
      Template_Debit_Note.belongsTo(models.Berita_Acara, {
        foreignKey: "berita_acara_id",
        as: "berita_acara",
      });
    }
  }
  Template_Debit_Note.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      berita_acara_id: {
        type: DataTypes.UUID,
      },
      debit_note_id: {
        type: DataTypes.UUID,
      },
      template_id: {
        type: DataTypes.UUID,
      },
      html_rendered: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Template_Debit_Note",
    }
  );
  return Template_Debit_Note;
};
