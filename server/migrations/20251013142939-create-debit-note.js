"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Debit_Notes", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      berita_acara_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Berita_Acaras",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      debit_note_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      batas_akhir: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dn_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      uraian: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      sub_total: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ppn: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Debit_Notes");
  },
};
