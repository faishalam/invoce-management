"use strict";
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    // ✅ Ambil Department yang sudah ada
    const departments = await queryInterface.sequelize.query(
      `SELECT id FROM "Departments" LIMIT 1;`, // ambil 1 dept dulu
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!departments.length) {
      throw new Error("No Departments found. Please seed Departments first!");
    }

    const department_id = departments[0].id;

    const data = [
      {
        id: uuidv4(),
        name: "Faishal Abdul Majid",
        email: "admin@gmail.com",
        password: bcrypt.hashSync("P@ssw0rdadmin", 10),
        department_id: department_id, // pakai UUID dari Departments
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Users", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
