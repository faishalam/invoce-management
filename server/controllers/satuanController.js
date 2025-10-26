const { Satuan } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

class SatuanController {
  // CREATE
  static async createSatuan(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const existing = await Satuan.findOne({ where: { name } });
      if (existing) {
        return res.status(400).json({ message: "Satuan already exists" });
      }

      const satuan = await Satuan.create({
        id: uuidv4(),
        name,
      });

      res.status(201).json({
        status: "success",
        message: "Satuan created successfully",
        data: satuan,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // READ ALL
  static async getAllSatuan(req, res) {
    try {
      const satuan = await Satuan.findAll({
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        status: "success",
        message: "Satuans fetched successfully",
        data: satuan,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE
  static async deleteSatuan(req, res) {
    try {
      const { id } = req.params;
      const satuan = await Satuan.findByPk(id);

      if (!satuan) {
        return res.status(404).json({ message: "Satuan not found" });
      }

      await Satuan.destroy({ where: { id } });

      res.status(200).json({
        status: "success",
        message: "Satuan deleted successfully",
        data: null,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateSatuan(req, res) {
    try {
      const { id } = req.params;
      const { name, code } = req.body; // ✅ tambahkan code di sini

      // 1️⃣ Pastikan data dengan ID tersebut ada
      const satuan = await Satuan.findByPk(id);
      if (!satuan) {
        return res.status(404).json({ message: "Satuan not found" });
      }

      // 2️⃣ Cek apakah nama sudah digunakan oleh satuan lain (bukan dirinya sendiri)
      const existing = await Satuan.findOne({
        where: {
          name,
          id: { [Op.ne]: id }, // ✅ hindari bentrok dengan diri sendiri
        },
      });

      if (existing) {
        return res.status(400).json({ message: "Satuan already exists" });
      }

      // 3️⃣ Update hanya field yang dikirim
      satuan.name = name ?? satuan.name;
      satuan.code = code ?? satuan.code;

      await satuan.save();

      // 4️⃣ Response sukses
      res.status(200).json({
        status: "success",
        message: "Satuan updated successfully",
        data: satuan,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = SatuanController;
