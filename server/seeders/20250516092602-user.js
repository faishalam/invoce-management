'use strict';
const bcrypt = require('bcryptjs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const data = require('../user.json', 'utf8').map((element) => {
      const salt = bcrypt.genSaltSync(8);
      const hash = bcrypt.hashSync(element.password, salt);

      delete element.id
      element.password = hash
      element.createdAt = new Date()
      element.updatedAt = new Date()
      return element
    })
    await queryInterface.bulkInsert("Users", data, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {})
  }
};
