"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Berita_Acaras", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
      },
      tipe_transaksi: {
        type: Sequelize.STRING,
      },
      jenis_berita_acara: {
        type: Sequelize.STRING,
      },
      number: {
        type: Sequelize.STRING,
      },
      site: {
        type: Sequelize.STRING,
      },
      customer_id: {
        type: Sequelize.UUID,
      },
      customer_code: {
        type: Sequelize.STRING,
      },
      periode: {
        type: Sequelize.STRING,
      },
      link_doc: {
        type: Sequelize.STRING,
      },
      signers: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      cut_off: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      tipe_customer: {
        type: Sequelize.STRING,
      },
      type_of_work_id: {
        type: Sequelize.UUID,
      },
      reguler: {
        type: Sequelize.STRING,
      },
      pic: {
        type: Sequelize.STRING,
      },
      submitted_at: {
        type: Sequelize.STRING,
      },
      nill_ditagihkan: {
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
    await queryInterface.dropTable("Berita_Acaras");
  },
};
