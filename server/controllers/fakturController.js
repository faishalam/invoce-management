const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { Faktur, Berita_Acara, Debit_Note } = require("../models");

class FakturController {
  static async createFaktur(req, res) {
    try {
      const {
        berita_acara_id,
        debit_note_id,
        nomor_seri_faktur,
        masa_pajak,
        tahun,
        npwp,
        customer_id,
        sub_total,
        dpp_nilai_lain_fk,
        ppn_fk,
        jumlah_ppn_fk,
        kode_objek,
        uraian,
        ppn_of,
      } = req.body;

      const findBeritaAcara = await Berita_Acara.findByPk(berita_acara_id);

      await findBeritaAcara.update({ status: "Submitted Faktur" });

      const faktur = await Faktur.create({
        id: uuidv4(),
        berita_acara_id,
        debit_note_id,
        nomor_seri_faktur,
        masa_pajak,
        tahun,
        npwp,
        customer_id,
        sub_total,
        dpp_nilai_lain_fk,
        ppn_fk,
        jumlah_ppn_fk,
        kode_objek,
        ppn_of,
      });

      const findDebitNote = await Debit_Note.findByPk(debit_note_id);
      await findDebitNote.update({ uraian: uraian });

      return res.status(201).json({
        status: "success",
        message: "Faktur created successfully",
        data: faktur,
      });
    } catch (error) {
      console.log(error);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          status: "error",
          message: error.errors[0].message,
          data: null,
        });
      }

      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        data: null,
      });
    }
  }

  static async getAllFaktur(req, res) {
    try {
      const faktur = await Faktur.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Berita_Acara,
            as: "berita_acara",
            attributes: ["customer_id", "number"],
          },
          {
            model: Debit_Note,
            as: "debit_note",
            attributes: ["debit_note_number", "uraian"],
          },
        ],
      });

      return res.status(200).json({
        status: "success",
        message: "Faktur fetched successfully",
        data: faktur,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteFaktur(req, res) {
    try {
      const { id } = req.params;
      const faktur = await Faktur.findByPk(id);

      if (!faktur) {
        return res.status(404).json({ message: "Faktur not found" });
      }

      const findBeritaAcara = await Berita_Acara.findByPk(
        faktur.berita_acara_id
      );

      await findBeritaAcara.update({ status: "Submitted Debit Note" });

      await Faktur.destroy({ where: { id } });

      res.status(200).json({
        status: "success",
        message: "Goods deleted successfully",
        data: null,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateFaktur(req, res) {
    try {
      const { id } = req.params;

      const faktur = await Faktur.findByPk(id);
      if (!faktur) {
        return res.status(404).json({ message: "Faktur not found" });
      }

      const {
        berita_acara_id,
        debit_note_id,
        nomor_seri_faktur,
        masa_pajak,
        tahun,
        npwp,
        customer_id,
        sub_total,
        dpp_nilai_lain_fk,
        ppn_fk,
        jumlah_ppn_fk,
        kode_objek,
        uraian,
        ppn_of,
      } = req.body;

      await Faktur.update({
        berita_acara_id,
        debit_note_id,
        nomor_seri_faktur,
        masa_pajak,
        tahun,
        npwp,
        customer_id,
        sub_total,
        dpp_nilai_lain_fk,
        ppn_fk,
        jumlah_ppn_fk,
        kode_objek,
        uraian,
        ppn_of,
      });
      return res.status(200).json({
        status: "success",
        message: "Faktur created successfully",
        data: faktur,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async fakturById(req, res) {
    try {
      const { id } = req.params;

      const faktur = await Faktur.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Berita_Acara,
            as: "berita_acara",
            attributes: ["customer_id", "number"],
          },
          {
            model: Debit_Note,
            as: "debit_note",
            attributes: ["debit_note_number", "uraian"],
          },
        ],
      });
      return res.status(200).json({
        status: "success",
        message: "Faktur fetched successfully",
        data: faktur,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = FakturController;
