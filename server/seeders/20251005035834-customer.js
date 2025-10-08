"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../customer.json").map((element) => {
      return {
        id: uuidv4(),
        name: element.name,
        code: element.code,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert("Customers", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Customers", null, {});
  },
};
