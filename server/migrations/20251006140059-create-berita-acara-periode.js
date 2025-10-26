"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Berita_Acara_Periodes", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      berita_acara_id: {
        type: Sequelize.UUID,
        references: {
          model: "Berita_Acaras",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      plan_alokasi_periode: {
        type: Sequelize.STRING,
      },
      harga_per_liter: {
        type: Sequelize.STRING,
      },
      plan_liter: {
        type: Sequelize.STRING,
      },
      actual_liter: {
        type: Sequelize.STRING,
      },
      total_kelebihan: {
        type: Sequelize.STRING,
      },
      alokasi_backcharge: {
        type: Sequelize.STRING,
      },
      nilai_backcharge: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Berita_Acara_Periodes");
  },
};
