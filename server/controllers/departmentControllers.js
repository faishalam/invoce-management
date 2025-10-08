const { Department } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

class DepartmentController {
  // CREATE
  static async createDepartment(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const existing = await Department.findOne({ where: { name } });
      if (existing) {
        return res.status(400).json({ message: "Department already exists" });
      }

      const department = await Department.create({
        id: uuidv4(),
        name,
      });

      res.status(201).json({
        status: "success",
        message: "Department created successfully",
        data: department,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // READ ALL
  static async getAllDepartments(req, res) {
    try {
      const departments = await Department.findAll({
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        status: "success",
        message: "Departments fetched successfully",
        data: departments,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE
  static async deleteDepartment(req, res) {
    try {
      const { id } = req.params;
      const department = await Department.findByPk(id);

      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      await Department.destroy({ where: { id } });

      res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateDepartment(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      // Cek apakah department dengan ID tersebut ada
      const department = await Department.findByPk(id);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      // Cek apakah nama sudah digunakan oleh department lain (id ≠ id sekarang)
      const existing = await Department.findOne({
        where: {
          name,
          id: { [Op.ne]: id }, // ✅ pastikan bukan dirinya sendiri
        },
      });

      if (existing) {
        return res.status(400).json({ message: "Department already exists" });
      }

      // Update field (hanya ubah jika name dikirim)
      department.name = name ?? department.name;

      await department.save();

      res.status(200).json({
        status: "success",
        message: "Department updated successfully",
        data: department,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = DepartmentController;
