"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../satuan.json").map((element) => {
      return {
        id: uuidv4(),
        name: element.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert("Satuans", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Satuans", null, {});
  },
};
