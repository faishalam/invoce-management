const { TypeOfWork } = require("../models");
const { v4: uuidv4 } = require("uuid");

class TypeOfWorkController {
  // CREATE
  static async createTypeOfWork(req, res) {
    try {
      const { name, type } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const existing = await TypeOfWork.findOne({ where: { name } });
      if (existing) {
        return res.status(400).json({ message: "TypeOfWork already exists" });
      }

      const typeOfWork = await TypeOfWork.create({
        id: uuidv4(),
        name,
        type,
      });

      res.status(201).json({
        status: "success",
        message: "TypeOfWork created successfully",
        data: typeOfWork,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // READ ALL
  static async getAllTypeOfWork(req, res) {
    try {
      const typeOfWork = await TypeOfWork.findAll({
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        status: "success",
        message: "TypeOfWorks fetched successfully",
        data: typeOfWork,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE
  static async deleteTypeOfWork(req, res) {
    try {
      const { id } = req.params;
      const typeOfWork = await TypeOfWork.findByPk(id);

      if (!typeOfWork) {
        return res.status(404).json({ message: "TypeOfWork not found" });
      }

      await TypeOfWork.destroy({ where: { id } });

      res.status(200).json({
        status: "success",
        message: "TypeOfWork deleted successfully",
        data: null,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateTypeOfWork(req, res) {
    try {
      const { id } = req.params;
      const { name, type } = req.body;

      const typeOfWork = await TypeOfWork.findByPk(id);
      if (!typeOfWork) {
        return res.status(404).json({ message: "Jenis Pekerjaan not found" });
      }

      // Validasi unik name jika name berubah
      if (name && name !== typeOfWork.name) {
        const existingName = await TypeOfWork.findOne({ where: { name } });
        if (existingName) {
          return res
            .status(400)
            .json({
              message: "Jenis Pekerjaan dengan nama tersebut sudah ada",
            });
        }
      }

      // Update hanya field yang dikirim
      if (name) typeOfWork.name = name;
      if (type) typeOfWork.type = type;

      await typeOfWork.save();

      res.status(200).json({
        status: "success",
        message: "Jenis Pekerjaan updated successfully",
        data: typeOfWork,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = TypeOfWorkController;
