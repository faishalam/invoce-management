const {
  Berita_Acara,
  Berita_Acara_Periode,
  User,
  sequelize,
} = require("../models");
const { generateNoBA } = require("../helpers/generateNoBA"); // pastikan helper ini ada

class BeritaAcaraController {
  // 🔹 CREATE
  static async createBeritaAcara(req, res) {
    const t = await sequelize.transaction();
    try {
      const user_id = req.user.id;
      const site = "Y";
      const body = req.body;
      const { tipe_transaksi, jenis_berita_acara, planAlokasiPeriode } = body;

      // Ambil nomor terakhir
      const lastBA = await Berita_Acara.findOne({
        order: [["createdAt", "DESC"]],
      });
      const lastNumber = lastBA
        ? parseInt(lastBA.number.split("/")[1]) || 0
        : 0;
      const number = generateNoBA(lastNumber, tipe_transaksi);

      // Payload dasar
      const baseData = {
        ...body,
        number,
        site,
        user_id,
      };

      // Validasi kombinasi tipe
      const isTrade = tipe_transaksi === "trade";
      const isNonTrade = tipe_transaksi === "nontrade";
      const isFuel = jenis_berita_acara === "fuel";

      let beritaAcara;

      if (isTrade && !isFuel) {
        // TRADE (non-fuel)
        beritaAcara = await Berita_Acara.create(baseData, { transaction: t });
      } else if (isNonTrade && !isFuel) {
        // NONTRADE (non-fuel)
        beritaAcara = await Berita_Acara.create(baseData, { transaction: t });
      } else if (isNonTrade && isFuel) {
        // NONTRADE (fuel)
        beritaAcara = await Berita_Acara.create(baseData, { transaction: t });

        if (
          Array.isArray(planAlokasiPeriode) &&
          planAlokasiPeriode.length > 0
        ) {
          const periodeList = planAlokasiPeriode.map((p) => ({
            berita_acara_id: beritaAcara.id,
            ...p,
          }));
          await Berita_Acara_Periode.bulkCreate(periodeList, {
            transaction: t,
          });
        }
      } else {
        throw new Error(
          "Kombinasi tipe_transaksi / jenis_berita_acara tidak valid"
        );
      }

      await t.commit();
      return res.status(201).json({
        status: "success",
        message: `Berita Acara (${tipe_transaksi}) created successfully`,
        data: beritaAcara,
      });
    } catch (error) {
      await t.rollback();
      console.error("❌ Error createBeritaAcara:", error);
      return res.status(500).json({
        status: "error",
        message: error.message || "Internal server error",
      });
    }
  }

  // 🔹 GET ALL
  static async getAllBeritaAcara(req, res) {
    try {
      const userId = req.user.id;
      const userLogin = await User.findByPk(userId);
      if (!userLogin) {
        return res
          .status(404)
          .json({ status: "error", message: "User tidak ditemukan" });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 999999;
      const offset = (page - 1) * limit;
      const { tipe_transaksi } = req.query;

      const whereCondition = {};
      if (tipe_transaksi) whereCondition.tipe_transaksi = tipe_transaksi;

      const { count, rows } = await Berita_Acara.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: User,
            attributes: ["id", "name", "departmentId"],
            where: { departmentId: userLogin.departmentId },
          },
          {
            model: Berita_Acara_Periode,
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

      return res.status(200).json({
        status: "success",
        message: "Berita Acara fetched successfully",
        data: rows,
        pagination: {
          totalData: count,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          perPage: limit,
        },
      });
    } catch (error) {
      console.error("Error fetching Berita Acara:", error);
      return res.status(500).json({
        status: "error",
        message: error.message || "Internal server error",
      });
    }
  }

  // 🔹 GET BY ID
  static async getBeritaAcaraById(req, res) {
    try {
      const { id } = req.params;
      const beritaAcara = await Berita_Acara.findByPk(id, {
        include: [{ model: Berita_Acara_Periode }],
      });

      if (!beritaAcara)
        return res
          .status(404)
          .json({ status: "error", message: "Berita Acara not found" });

      return res.status(200).json({
        status: "success",
        data: beritaAcara,
      });
    } catch (error) {
      console.error("Error getBeritaAcaraById:", error);
      return res.status(500).json({
        status: "error",
        message: error.message || "Internal server error",
      });
    }
  }

  // 🔹 UPDATE
  static async updateBeritaAcara(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const body = req.body;
      const { tipe_transaksi, jenis_berita_acara, planAlokasiPeriode } = body;

      const beritaAcara = await Berita_Acara.findByPk(id, { transaction: t });
      if (!beritaAcara) throw new Error("Berita Acara not found");

      await beritaAcara.update(body, { transaction: t });

      if (tipe_transaksi === "nontrade" && jenis_berita_acara === "fuel") {
        await Berita_Acara_Periode.destroy({
          where: { berita_acara_id: id },
          transaction: t,
        });

        if (
          Array.isArray(planAlokasiPeriode) &&
          planAlokasiPeriode.length > 0
        ) {
          const periodeList = planAlokasiPeriode.map((p) => ({
            berita_acara_id: id,
            ...p,
          }));
          await Berita_Acara_Periode.bulkCreate(periodeList, {
            transaction: t,
          });
        }
      }

      await t.commit();
      return res.status(200).json({
        status: "success",
        message: "Berita Acara updated successfully",
        data: beritaAcara,
      });
    } catch (error) {
      await t.rollback();
      console.error("Error updateBeritaAcara:", error);
      return res.status(500).json({
        status: "error",
        message: error.message || "Internal server error",
      });
    }
  }

  // 🔹 DELETE
  static async deleteBeritaAcara(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const beritaAcara = await Berita_Acara.findByPk(id, { transaction: t });
      if (!beritaAcara) throw new Error("Berita Acara not found");

      await Berita_Acara_Periode.destroy({
        where: { berita_acara_id: id },
        transaction: t,
      });
      await beritaAcara.destroy({ transaction: t });

      await t.commit();
      return res.status(200).json({
        status: "success",
        message: "Berita Acara deleted successfully",
      });
    } catch (error) {
      await t.rollback();
      console.error("Error deleteBeritaAcara:", error);
      return res.status(500).json({
        status: "error",
        message: error.message || "Internal server error",
      });
    }
  }
}

module.exports = BeritaAcaraController;
