"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../typeOfWork.json").map((element) => {
      return {
        id: uuidv4(),
        name: element.name,
        type: element.type,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert("TypeOfWorks", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TypeOfWorks", null, {});
  },
};
