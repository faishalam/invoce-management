"use strict";

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Baca isi file HTML
    const htmlPath = path.join(__dirname, "../general.html");
    const htmlContent = fs.readFileSync(htmlPath, "utf8");

    // Masukkan data ke tabel Templates
    await queryInterface.bulkInsert("Templates", [
      {
        id: uuidv4(),
        code: "BA-GENERAL",
        content: htmlContent,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Hapus data yang tadi dimasukkan
    await queryInterface.bulkDelete("Templates", { name: "General" }, {});
  },
};
