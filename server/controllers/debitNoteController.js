const {
  Debit_Note,
  Template,
  Template_Debit_Note,
  sequelize,
  Berita_Acara,
  Berita_Acara_Uraian,
} = require("../models");
const { v4: uuidv4 } = require("uuid");

class DebitNoteController {
  static async createDebitNote(req, res) {
    const t = await sequelize.transaction();
    try {
      const yearSuffix = new Date().getFullYear().toString().slice(-2);
      const count = await Debit_Note.count();
      const nextNumber = String(count + 24).padStart(3, "0");
      const debitNoteNumber = `${yearSuffix}D${nextNumber}YY`;

      const {
        berita_acara_id,
        sub_total,
        ppn,
        total,
        uraian,
        harga_terbilang,
        periode,
        dpp_nilai_lain_fk,
      } = req.body;

      if (!berita_acara_id) {
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
        include: [
          {
            model: Berita_Acara_Uraian,
            as: "berita_acara_uraian",
          },
        ],
      });

      if (findBeritaAcara?.status.toLowerCase() !== "signed") {
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
          sub_total,
          ppn,
          harga_terbilang,
          total,
          dpp_nilai_lain_fk,
          periode,
        },
        { transaction: t }
      );

      await Promise.all(
        uraian?.map((item) =>
          Berita_Acara_Uraian.update(
            {
              ...item,
            },
            {
              where: { id: item.id },
              transaction: t,
            }
          )
        )
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
            attributes: ["customer_id", "number", "status", "revised"],
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
            attributes: [
              "number",
              "customer_id",
              "id",
              "jenis_berita_acara",
              "periode",
            ],
            include: [
              {
                model: Berita_Acara_Uraian,
                as: "berita_acara_uraian",
              },
            ],
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
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const {
        berita_acara_id,
        sub_total,
        ppn,
        total,
        uraian,
        harga_terbilang,
        periode,
        dpp_nila_lain_fk,
      } = req.body;

      // --- Cek data Debit Note ---
      const findDebitNote = await Debit_Note.findByPk(id, { transaction: t });

      if (!findDebitNote) {
        await t.rollback();
        return res.status(404).json({
          status: "error",
          message: "Debit Note not found",
        });
      }

      // --- Cek berita acara terkait ---
      const findBeritaAcara = await Berita_Acara.findByPk(
        berita_acara_id || findDebitNote.berita_acara_id,
        {
          transaction: t,
          include: [
            {
              model: Berita_Acara_Uraian,
              as: "berita_acara_uraian",
            },
          ],
        }
      );

      if (!findBeritaAcara) {
        await t.rollback();
        return res.status(404).json({
          status: "error",
          message: "Berita Acara not found",
        });
      }

      if (findBeritaAcara?.status === "Waiting Signed") {
        await t.rollback();
        return res.status(400).json({
          status: "error",
          message: "Berita Acara belum disetujui",
        });
      }

      // --- Update uraian kalau dikirim ---
      if (Array.isArray(uraian) && uraian.length > 0) {
        await Promise.all(
          uraian.map((item) =>
            Berita_Acara_Uraian.update(
              { ...item },
              {
                where: { id: item.id },
                transaction: t,
              }
            )
          )
        );
      }

      // --- Update data debit note utama ---
      const now = new Date();
      const batasAkhir = new Date(
        now.setDate(now.getDate() + 30)
      ).toISOString();

      await findDebitNote.update(
        {
          berita_acara_id: berita_acara_id ?? findDebitNote.berita_acara_id,
          sub_total: sub_total ?? findDebitNote.sub_total,
          ppn: ppn ?? findDebitNote.ppn,
          total: total ?? findDebitNote.total,
          batas_akhir: batasAkhir,
          harga_terbilang: harga_terbilang ?? findDebitNote.harga_terbilang,
          periode: periode ?? findDebitNote.periode,
          dpp_nila_lain_fk: dpp_nila_lain_fk ?? findDebitNote.dpp_nila_lain_fk,
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(200).json({
        status: "success",
        message: "Debit Note updated successfully",
        data: findDebitNote,
      });
    } catch (error) {
      console.error("❌ Error updating debit note:", error);
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

  static async deleteDebitNote(req, res) {
    try {
      const debitNote = await Debit_Note.findByPk(req.params.id);

      const findBeritaAcara = await Berita_Acara.findByPk(
        debitNote.berita_acara_id
      );

      await findBeritaAcara.update({ status: "Signed" });

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
