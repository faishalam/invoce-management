const { Goods } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

class GoodsController {
  static async createGoods(req, res) {
    try {
      const { name, code } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const existing = await Goods.findOne({ where: { name } });
      if (existing) {
        return res.status(400).json({ message: "Goods already exists" });
      }

      const goods = await Goods.create({
        id: uuidv4(),
        name,
        code,
      });

      res.status(201).json({
        status: "success",
        message: "Goods created successfully",
        data: goods,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getAllGoods(req, res) {
    try {
      const goods = await Goods.findAll({
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        status: "success",
        message: "Goodss fetched successfully",
        data: goods,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteGoods(req, res) {
    try {
      const { id } = req.params;
      const goods = await Goods.findByPk(id);

      if (!goods) {
        return res.status(404).json({ message: "Goods not found" });
      }

      await Goods.destroy({ where: { id } });

      res.status(200).json({
        status: "success",
        message: "Goods deleted successfully",
        data: null,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateGoods(req, res) {
    try {
      const { id } = req.params;
      const { name, code } = req.body;

      const goods = await Goods.findByPk(id);
      if (!goods) {
        return res.status(404).json({ message: "Goods not found" });
      }

      const existing = await Goods.findOne({
        where: {
          name,
          id: { [Op.ne]: id },
        },
      });

      if (existing) {
        return res.status(400).json({ message: "Goods already exists" });
      }

      goods.name = name ?? goods.name;
      goods.code = code ?? goods.code;

      await goods.save();

      res.status(200).json({
        status: "success",
        message: "Goods updated successfully",
        data: goods,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = GoodsController;
