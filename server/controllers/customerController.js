const { Customer } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

class CustomerController {
  // CREATE
  static async createCustomer(req, res) {
    try {
      const { name, code, alamat, phone } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const existing = await Customer.findOne({ where: { name } });
      if (existing) {
        return res.status(400).json({ message: "Customer already exists" });
      }

      const customer = await Customer.create({
        id: uuidv4(),
        name,
        code,
        alamat,
        phone,
      });

      res.status(201).json({
        status: "success",
        message: "Customer created successfully",
        data: customer,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // READ ALL
  static async getAllCustomer(req, res) {
    try {
      const customer = await Customer.findAll({
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        status: "success",
        message: "Customers fetched successfully",
        data: customer,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE
  static async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const customer = await Customer.findByPk(id);

      if (!Customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      await customer.destroy({ where: { id } });

      res.status(200).json({
        status: "success",
        message: "Customer deleted successfully",
        data: null,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateCustomer(req, res) {
    try {
      const { id } = req.params;
      const { name, code, alamat, phone } = req.body;

      // Cari customer berdasarkan id dulu
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      // Cek apakah nama baru sudah dipakai oleh customer lain
      const existing = await Customer.findOne({
        where: {
          name,
          id: { [Op.ne]: id }, // ✅ pastikan bukan dirinya sendiri
        },
      });

      if (existing) {
        return res.status(400).json({ message: "Customer already exists" });
      }

      // Update data
      customer.name = name ?? customer.name;
      customer.code = code ?? customer.code;
      customer.alamat = alamat ?? customer.alamat;
      customer.phone = phone ?? customer.phone;
      await customer.save();

      res.status(200).json({
        status: "success",
        message: "Customer updated successfully",
        data: customer,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = CustomerController;
