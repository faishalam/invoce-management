"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Fakturs", {
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
      debit_note_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Debit_Notes",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      nomor_seri_faktur: {
        type: Sequelize.STRING,
      },
      masa_pajak: {
        type: Sequelize.STRING,
      },
      tahun: {
        type: Sequelize.STRING,
      },
      npwp: {
        type: Sequelize.STRING,
      },
      customer_id: {
        type: Sequelize.STRING,
      },
      sub_total: {
        type: Sequelize.STRING,
      },
      dpp_nilai_lain_fk: {
        type: Sequelize.STRING,
      },
      ppn_fk: {
        type: Sequelize.STRING,
      },
      jumlah_ppn_fk: {
        type: Sequelize.STRING,
      },
      kode_objek: {
        type: Sequelize.STRING,
      },
      ppn_of: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable("Fakturs");
  },
};
