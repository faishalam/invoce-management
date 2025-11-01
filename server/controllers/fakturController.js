const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const {
  Faktur,
  Berita_Acara,
  Debit_Note,
  Berita_Acara_Uraian,
} = require("../models");

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
        ppn_of,
      } = req.body;

      const findBeritaAcara = await Berita_Acara.findByPk(berita_acara_id, {
        include: [
          {
            model: Berita_Acara_Uraian,
            as: "berita_acara_uraian",
          },
        ],
      });

      if (!findBeritaAcara) {
        return res.status(404).json({
          status: "error",
          message: "Berita Acara not found",
        });
      }

      // Update status berita acara
      await findBeritaAcara.update({ status: "Submitted Faktur" });

      // Buat faktur
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

      // Update semua uraian terkait berita acara ini
      await Berita_Acara_Uraian.update(
        {
          dpp_nilai_lain_of: dpp_nilai_lain_fk,
          jumlah_ppn_of: jumlah_ppn_fk,
        },
        {
          where: { berita_acara_id },
        }
      );

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
            attributes: ["customer_id", "number", "status"],
            include: [
              {
                model: Berita_Acara_Uraian,
                as: "berita_acara_uraian",
              },
            ],
          },
          {
            model: Debit_Note,
            as: "debit_note",
            attributes: ["debit_note_number"],
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
        return res.status(404).json({
          status: "error",
          message: "Faktur not found",
        });
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

      await faktur.update({
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

      if (berita_acara_id) {
        await Berita_Acara_Uraian.update(
          {
            dpp_nilai_lain_of: dpp_nilai_lain_fk,
            jumlah_ppn_of: jumlah_ppn_fk,
          },
          {
            where: { berita_acara_id },
          }
        );
      }

      return res.status(200).json({
        status: "success",
        message: "Faktur updated successfully",
        data: faktur,
      });
    } catch (error) {
      console.error("❌ Error updateFaktur:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
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
            include: [
              {
                model: Berita_Acara_Uraian,
                as: "berita_acara_uraian",
              },
            ],
          },
          {
            model: Debit_Note,
            as: "debit_note",
            attributes: ["debit_note_number"],
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

  static async acceptedFaktur(req, res) {
    try {
      const { id } = req.params;
      const { nomor_seri_faktur, kode_objek } = req.body;

      const findFaktur = await Faktur.findByPk(id);
      if (!findFaktur) {
        return res.status(404).json({
          status: "error",
          message: "Faktur tidak ditemukan",
        });
      }

      const findBeritaAcara = await Berita_Acara.findByPk(
        findFaktur.berita_acara_id
      );
      if (!findBeritaAcara) {
        return res.status(404).json({
          status: "error",
          message: "Berita acara terkait tidak ditemukan",
        });
      }

      await Promise.all([
        findBeritaAcara.update({ status: "Faktur Accepted" }),
        findFaktur.update({ nomor_seri_faktur, kode_objek }),
      ]);

      return res.status(200).json({
        status: "success",
        message: "Faktur berhasil diterima",
        data: findFaktur,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message || "Terjadi kesalahan pada server",
      });
    }
  }

  static async transactionFaktur(req, res) {
    try {
      const { id } = req.params;
      const { transaction_id } = req.body;

      const findFaktur = await Faktur.findByPk(id);
      if (!findFaktur) {
        return res.status(404).json({
          status: "error",
          message: "Faktur tidak ditemukan",
        });
      }

      const findBeritaAcara = await Berita_Acara.findByPk(
        findFaktur.berita_acara_id
      );
      if (!findBeritaAcara) {
        return res.status(404).json({
          status: "error",
          message: "Berita acara terkait tidak ditemukan",
        });
      }

      const cutOffDate = new Date(findBeritaAcara.cut_off);
      const transactionDate = new Date();
      const diffTime = Math.abs(transactionDate - cutOffDate);
      const range_periode = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // konversi ms → hari

      await Promise.all([
        findBeritaAcara.update({ status: "Done" }),
        findFaktur.update({ transaction_id, range_periode }),
      ]);

      return res.status(200).json({
        status: "success",
        message: "Faktur berhasil diproses dan range_periode dihitung",
        data: findFaktur,
      });
    } catch (error) {
      console.error("Error in transactionFaktur:", error);
      return res.status(500).json({
        status: "error",
        message: error.message || "Terjadi kesalahan pada server",
      });
    }
  }
}

module.exports = FakturController;
