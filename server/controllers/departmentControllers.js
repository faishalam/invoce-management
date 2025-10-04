const { Department } = require("../models");
const { v4: uuidv4 } = require("uuid");

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

      res.status(201).json(department);
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
      res.status(200).json(departments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // READ ONE
  static async getDepartmentById(req, res) {
    try {
      const { id } = req.params;
      const department = await Department.findByPk(id);

      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      res.status(200).json(department);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // UPDATE
  static async updateDepartment(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const department = await Department.findByPk(id);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      await Department.update({ name }, { where: { id } });

      res.status(200).json({ message: "Department updated successfully" });
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
}

module.exports = DepartmentController;
