const {
  Debit_Note,
  Template,
  Template_Debit_Note,
  sequelize,
  Berita_Acara,
} = require("../models");
const { v4: uuidv4 } = require("uuid");

class DebitNoteController {
  static async createDebitNote(req, res) {
    const t = await sequelize.transaction();
    try {
      const yearSuffix = new Date().getFullYear().toString().slice(-2);
      const count = await Debit_Note.count();
      const nextNumber = String(count + 1).padStart(3, "0");
      const debitNoteNumber = `${yearSuffix}D${nextNumber}YY`;

      const { berita_acara_id, uraian, sub_total, ppn, total } = req.body;

      if (!berita_acara_id || !uraian || !Array.isArray(uraian)) {
        return res.status(400).json({
          status: "error",
          message: "Field berita_acara_id, dan uraian[] wajib diisi.",
        });
      }

      const now = new Date();
      const batasAkhir = new Date(
        now.setDate(now.getDate() + 30)
      ).toISOString();

      const findBeritaAcara = await Berita_Acara.findByPk(berita_acara_id, {
        transaction: t,
      });

      if (findBeritaAcara?.status !== "Signed") {
        return res.status(400).json({
          status: "error",
          message: "Berita Acara belum disetujui",
        });
      }

      const debitNote = await Debit_Note.create(
        {
          id: uuidv4(),
          berita_acara_id,
          debit_note_number: debitNoteNumber,
          batas_akhir: batasAkhir,
          uraian,
          sub_total,
          ppn,
          total,
        },
        { transaction: t }
      );

      await findBeritaAcara.update(
        { status: "Submitted Debit Note" },
        { transaction: t }
      );

      await t.commit();
      return res.status(201).json({
        status: "success",
        message: "Debit note created successfully",
        data: debitNote,
      });
    } catch (error) {
      console.error("❌ Error creating debit note:", error);
      await t.rollback();

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

  static async getAllDebitNotes(req, res) {
    try {
      const debitNotes = await Debit_Note.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Berita_Acara,
            as: "berita_acara",
            attributes: ["customer_id", "number", "status"],
          },
        ],
      });

      return res.status(200).json({
        status: "success",
        message: "Debit notes fetched successfully",
        data: debitNotes,
      });
    } catch (error) {
      console.error("❌ Error fetching debit notes:", error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getDebitNoteById(req, res) {
    try {
      const debitNote = await Debit_Note.findByPk(req.params.id, {
        include: [
          {
            model: Template_Debit_Note,
            as: "template_debit_note",
          },
          {
            model: Berita_Acara,
            as: "berita_acara",
            attributes: ["number", "customer_id", "id"],
          },
        ],
      });

      if (!debitNote) {
        return res.status(404).json({
          status: "error",
          message: "Debit note not found",
          data: null,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Debit note fetched successfully",
        data: debitNote,
      });
    } catch (error) {
      console.error("❌ Error fetching debit note by ID:", error);
      return res.status(500).json({
        status: "error",
        message: error.message,
        data: null,
      });
    }
  }

  static async updateDebitNote(req, res) {
    try {
      const debitNote = await Debit_Note.findByPk(req.params.id);

      if (!debitNote) {
        return res.status(404).json({
          status: "error",
          message: "Debit note not found",
          data: null,
        });
      }

      const {
        berita_acara_id,
        customer_name,
        customer_code,
        phone,
        alamat,
        uraian,
        sub_total,
        ppn,
        total,
      } = req.body;

      debitNote.set({
        berita_acara_id: berita_acara_id ?? debitNote.berita_acara_id,
        customer_name: customer_name ?? debitNote.customer_name,
        customer_code: customer_code ?? debitNote.customer_code,
        phone: phone ?? debitNote.phone,
        alamat: alamat ?? debitNote.alamat,
        batas_akhir: debitNote.batas_akhir,
        uraian: uraian ?? debitNote.uraian,
        sub_total: sub_total ?? debitNote.sub_total,
        ppn: ppn ?? debitNote.ppn,
        total: total ?? debitNote.total,
      });

      await debitNote.save();

      return res.status(200).json({
        status: "success",
        message: "Debit note updated successfully",
        data: debitNote,
      });
    } catch (error) {
      console.error("❌ Error updating debit note:", error);
      return res.status(500).json({
        status: "error",
        message: error.message,
        data: null,
      });
    }
  }

  static async deleteDebitNote(req, res) {
    try {
      const debitNote = await Debit_Note.findByPk(req.params.id);

      const findBeritaAcara = await Berita_Acara.findByPk(
        debitNote.berita_acara_id
      );

      await findBeritaAcara.update({ status: "Submitted Berita Acara" });

      if (!debitNote) {
        return res.status(404).json({
          status: "error",
          message: "Debit note not found",
          data: null,
        });
      }

      await debitNote.destroy();

      return res.status(200).json({
        status: "success",
        message: "Debit note deleted successfully",
      });
    } catch (error) {
      console.error("❌ Error deleting debit note:", error);
      return res.status(500).json({
        status: "error",
        message: error.message,
        data: null,
      });
    }
  }
}

module.exports = DebitNoteController;
