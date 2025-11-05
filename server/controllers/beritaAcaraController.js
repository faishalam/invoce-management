const {
  Berita_Acara,
  Berita_Acara_Periode,
  User,
  sequelize,
  Template_Berita_Acara,
  Berita_Acara_Uraian,
  Debit_Note,
  Faktur,
  Department,
  Goods,
  Satuan,
} = require("../models");
const { generateNoBA } = require("../helpers/generateNoBA");
const cron = require("node-cron");
const {
  sendReminderRutinity,
  sendReminderWaitingBA,
} = require("../helpers/nodemailer");

cron.schedule(
  "0 9 26 * *",
  async () => {
    try {
      const users = await User.findAll({
        attributes: ["email"],
      });
      const emailList = users.map((u) => u.email).filter(Boolean);
      if (emailList.length === 0) {
        console.log("❌ Tidak ada email user ditemukan.");
        return;
      }
      await sendReminderRutinity(emailList);
      console.log("✅ Email reminder berhasil dikirim ke semua user.");
    } catch (err) {
      console.error("❌ Gagal menjalankan cron:", err);
    }
  },
  {
    timezone: "Asia/Jakarta",
  }
);

cron.schedule(
  "0 9 30 * *",
  async () => {
    try {
      const users = await User.findAll({
        attributes: ["email"],
      });
      const emailList = users.map((u) => u.email).filter(Boolean);
      if (emailList.length === 0) {
        return;
      }
      await sendReminderRutinity(emailList);
    } catch (err) {
      console.error("❌ Gagal menjalankan cron:", err);
    }
  },
  {
    timezone: "Asia/Jakarta",
  }
);

cron.schedule(
  "0 9 * * *",
  async () => {
    try {
      const waitingBAList = await Berita_Acara.findAll({
        where: { status: "Waiting Signed" },
        include: [
          {
            model: User,
            as: "User",
            attributes: ["id", "name", "email"],
            include: [
              {
                model: Department,
                as: "department",
                attributes: ["name"],
              },
            ],
          },
        ],
      });

      if (!waitingBAList.length) {
        console.log("Tidak ada Berita Acara yang masih Waiting Signed.");
        return;
      }

      const groupedByUser = {};
      for (const ba of waitingBAList) {
        const email = ba.User?.email;
        if (!email) continue;

        if (!groupedByUser[email]) {
          groupedByUser[email] = {
            name: ba.User.name,
            email,
            department: ba.User?.department?.name,
            baList: [],
          };
        }

        groupedByUser[email].baList.push(ba);
      }

      for (const email in groupedByUser) {
        const userData = groupedByUser[email];
        let cc = [];
        switch (userData.department) {
          case "HCGS":
            cc = [
              "roni.wardana@kppmining.com",
              "muhammad.luthfi@kppmining.com",
              "a.rafik@kppmining.com",
              "fredy.wijaya@kppmining.com",
              "cholis.tanthowi@kppmining.com",
              "andi.naufal@kppmining.com",
              "ari.pratama@kppmining.com",
            ];
            break;
          case "SHE":
            cc = [
              "adiyanto.putera@kppmining.com",
              "adam.hanafi@kppmining.com",
              "yogi.aditya@kppmining.com",
              "cholis.tanthowi@kppmining.com",
              "andi.naufal@kppmining.com",
              "ari.pratama@kppmining.com",
            ];
            break;
          case "PLANT":
            cc = [
              "muhammad.hijaz@kppmining.com",
              "reza.sukendi@kppmining.com",
              "yunus.hanung@kppmining.com",
              "toto.suryanto@kppmining.com",
              "cholis.tanthowi@kppmining.com",
              "andi.naufal@kppmining.com",
              "ari.pratama@kppmining.com",
            ];
            break;
          case "PROD":
            cc = [
              "canda.parawansyah@kppmining.com",
              "ignatius.indriyanto@kppmining.com",
              "feri.istiono@kppmining.com",
              "imam.himawan@kppmining.com",
              "cholis.tanthowi@kppmining.com",
              "andi.naufal@kppmining.com",
              "ari.pratama@kppmining.com",
            ];
            break;
          default:
            cc = [];
        }
        await sendReminderWaitingBA(userData.email, userData.baList, cc);
      }
    } catch (error) {
      console.error("[CRON ERROR Waiting Signed Reminder]:", error);
    }
  },
  {
    timezone: "Asia/Jakarta",
  }
);

class BeritaAcaraController {
  static async getAllCalculate(req, res) {
    try {
      const userId = req.user.id;
      const userLogin = await User.findByPk(userId, {
        include: [
          { model: Department, attributes: ["id", "name"], as: "department" },
        ],
      });

      if (!userLogin) {
        return res
          .status(404)
          .json({ status: "error", message: "User tidak ditemukan" });
      }

      const isFAT = userLogin.department?.name === "FAT";

      const userWhere = isFAT ? {} : { department_id: userLogin.department_id };

      const getAllBeritaAcara = await Berita_Acara.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "department_id"],
            where: userWhere,
          },
        ],
      });

      const beritaAcaraIds = getAllBeritaAcara.map((ba) => ba.id);

      const getAllDebitNote = await Debit_Note.findAll({
        where: isFAT ? {} : { berita_acara_id: beritaAcaraIds },
      });

      const getAllFaktur = await Faktur.findAll({
        where: isFAT ? {} : { berita_acara_id: beritaAcaraIds },
      });

      return res.status(200).json({
        status: "success",
        data: {
          totalBeritaAcara: getAllBeritaAcara.length,
          totalDebitNote: getAllDebitNote.length,
          totalFaktur: getAllFaktur.length,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
  static async createBeritaAcara(req, res) {
    const t = await sequelize.transaction();
    try {
      const user_id = req.user.id;
      const site = "SPRL";
      const body = req.body;
      const {
        tipe_transaksi,
        jenis_berita_acara,
        plan_alokasi_periode,
        berita_acara_uraian,
      } = body;

      if (!tipe_transaksi || !jenis_berita_acara) {
        return res.status(400).json({
          status: "error",
          message: "Field tipe_transaksi dan jenis_berita_acara wajib diisi",
        });
      }

      const lastBA = await Berita_Acara.findOne({
        order: [["createdAt", "DESC"]],
        transaction: t,
      });

      const lastNumber = lastBA
        ? parseInt(lastBA.number.split("/")[1]) || 0
        : 0;
      const number = generateNoBA(lastNumber, tipe_transaksi);

      const baseData = {
        ...body,
        user_id,
        number,
        site,
        status: "Waiting Signed",
      };

      const isTrade = tipe_transaksi === "trade";
      const isNonTrade = tipe_transaksi === "nontrade";
      const isFuel = jenis_berita_acara === "fuel";

      let beritaAcara;

      if (isTrade) {
        beritaAcara = await Berita_Acara.create(baseData, { transaction: t });
      } else if (isNonTrade && !isFuel) {
        beritaAcara = await Berita_Acara.create(baseData, { transaction: t });
        if (
          Array.isArray(berita_acara_uraian) &&
          berita_acara_uraian.length > 0
        ) {
          const uraian = berita_acara_uraian.map((p) => ({
            berita_acara_id: beritaAcara.id,
            ...p,
          }));
          await Berita_Acara_Uraian.bulkCreate(uraian, { transaction: t });
        } else {
          throw new Error(
            "Kombinasi tipe_transaksi / jenis_berita_acara tidak valid"
          );
        }
      } else if (isNonTrade && isFuel) {
        beritaAcara = await Berita_Acara.create(baseData, { transaction: t });

        if (
          Array.isArray(plan_alokasi_periode) &&
          plan_alokasi_periode.length > 0
        ) {
          const periodeList = plan_alokasi_periode.map((p) => ({
            berita_acara_id: beritaAcara.id,
            ...p,
          }));
          await Berita_Acara_Periode.bulkCreate(periodeList, {
            transaction: t,
          });

          const findGoods = await Goods.findOne({
            where: { name: "Backcharge Fuel" },
            transaction: t,
          });
          const findSatuan = await Satuan.findOne({
            where: { name: "LITER" },
            transaction: t,
          });

          const uraianFuel = plan_alokasi_periode.map((p) => ({
            berita_acara_id: beritaAcara.id,
            goods_id: findGoods?.id,
            satuan: findSatuan?.name,
            quantity: p.alokasi_backcharge,
            harga: p.harga_per_liter,
            total: p.nilai_backcharge,
          }));

          await Berita_Acara_Uraian.bulkCreate(uraianFuel, { transaction: t });
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
      console.log(error, "shibal");
      if (t) await t.rollback();
      return res.status(500).json({
        status: "error",
        message: error.message || "Internal server error",
      });
    }
  }
  static async getAllBeritaAcara(req, res) {
    try {
      const userId = req.user.id;

      const userLogin = await User.findByPk(userId, {
        include: [
          { model: Department, attributes: ["id", "name"], as: "department" },
        ],
      });

      if (!userLogin) {
        return res
          .status(404)
          .json({ status: "error", message: "User tidak ditemukan" });
      }

      const isFAT = userLogin.department?.name === "FAT";

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 999999;
      const offset = (page - 1) * limit;
      const { tipe_transaksi } = req.query;
      const { status } = req.query;

      const whereCondition = {};
      if (tipe_transaksi) whereCondition.tipe_transaksi = tipe_transaksi;
      if (status) whereCondition.status = status;

      const { count, rows } = await Berita_Acara.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: User,
            attributes: ["id", "name", "department_id"],
            where: isFAT ? {} : { department_id: userLogin.department_id },
            required: true,
          },
          {
            model: Debit_Note,
            as: "debit_note",
            required: false,
            attributes: ["id"],
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
  static async beritaAcaraAcepted(req, res) {
    try {
      const { id } = req.params;
      const { link_doc } = req.body;

      const beritaAcara = await Berita_Acara.findByPk(id);
      if (!beritaAcara) {
        return res.status(404).json({ message: "Berita Acara not found" });
      }

      beritaAcara.status = "Signed";
      beritaAcara.link_doc = link_doc;
      await beritaAcara.save();

      return res.status(200).json({
        status: "success",
        message: "Berita Acara updated successfully",
        data: beritaAcara,
      });
    } catch (error) {
      console.error("Error updating Berita Acara:", error);
      return res.status(500).json({
        status: "error",
        message: error.message || "Internal server error",
      });
    }
  }

  static async getBeritaAcaraWaiting(res, req) {
    try {
      const userDept = req.user.department_id;

      const findUserDept = await Department.findOne({
        where: { department_id: userDept },
      });

      if (findUserDept !== "FAT") {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const beritaAcara = await Berita_Acara.findAll({
        where: { status: "waiting" },
      });

      return res.status(200).json({
        status: "success",
        data: beritaAcara,
      });
    } catch (error) {
      console.error("Error getBeritaAcaraWaiting:", error);
      return res.status(500).json({
        status: "error",
        message: error.message || "Internal server error",
      });
    }
  }

  static async getBeritaAcaraById(req, res) {
    try {
      const { id } = req.params;
      const beritaAcara = await Berita_Acara.findByPk(id, {
        include: [
          { model: Berita_Acara_Periode, as: "plan_alokasi_periode" },
          {
            model: Template_Berita_Acara,
            as: "template_berita_acara",
          },
          {
            model: Berita_Acara_Uraian,
            as: "berita_acara_uraian",
          },
        ],
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

  static async updateBeritaAcara(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const {
        tipe_transaksi,
        jenis_berita_acara,
        plan_alokasi_periode,
        berita_acara_uraian,
        nill_ditagihkan,
        ...baseData
      } = req.body;

      if (!tipe_transaksi || !jenis_berita_acara) {
        return res.status(400).json({
          status: "error",
          message: "Field tipe_transaksi dan jenis_berita_acara wajib diisi",
        });
      }

      // 🔹 Ambil berita acara beserta relasi
      const findBeritaAcara = await Berita_Acara.findByPk(id, {
        include: [
          { model: Berita_Acara_Periode, as: "plan_alokasi_periode" },
          { model: Berita_Acara_Uraian, as: "berita_acara_uraian" },
        ],
        transaction: t,
      });

      if (!findBeritaAcara) {
        return res.status(404).json({
          status: "error",
          message: "Berita Acara not found",
        });
      }

      const isTrade = tipe_transaksi === "trade";
      const isNonTrade = tipe_transaksi === "nontrade";
      const isFuel = jenis_berita_acara === "fuel";

      // 🔹 Update header Berita Acara
      await findBeritaAcara.update(
        { ...baseData, tipe_transaksi, jenis_berita_acara },
        { transaction: t }
      );
      if (nill_ditagihkan === "nill") {
        const findDebitNote = await Debit_Note.findOne({
          where: { berita_acara_id: id },
          transaction: t,
        });
        if (findDebitNote) {
          await findDebitNote.destroy({ transaction: t });
        }
        const findFaktur = await Faktur.findOne({
          where: { berita_acara_id: id },
          transaction: t,
        });
        if (findFaktur) {
          await findFaktur.destroy({ transaction: t });
        }
        await findBeritaAcara.update({ status: "Signed" }, { transaction: t });
      }

      // 🔹 Helper untuk upsert + delete missing
      async function syncItems(model, items, allowedFields = [], foreignKey) {
        if (!Array.isArray(items)) return;

        // Ambil semua id lama
        const existingItems = await model.findAll({
          where: { [foreignKey]: id },
          transaction: t,
        });

        const existingIds = existingItems.map((i) => i.id);
        const incomingIds = items.filter((i) => i.id).map((i) => i.id);

        // 1️⃣ Hapus item yang tidak ada di payload
        const toDelete = existingIds.filter(
          (eid) => !incomingIds.includes(eid)
        );
        if (toDelete.length > 0) {
          await model.destroy({
            where: { id: toDelete },
            transaction: t,
          });
        }

        // 2️⃣ Update atau create
        for (const item of items) {
          const data = {};
          for (const field of allowedFields) {
            if (item[field] !== undefined) data[field] = item[field];
          }

          if (item.id) {
            await model.update(data, {
              where: { id: item.id },
              transaction: t,
            });
          } else {
            await model.create(
              { ...data, [foreignKey]: id },
              { transaction: t }
            );
          }
        }
      }

      // 🔹 Non-trade + Fuel
      if (isNonTrade && isFuel) {
        // Sinkronkan tabel periode
        await syncItems(
          Berita_Acara_Periode,
          plan_alokasi_periode,
          [
            "plan_alokasi_periode",
            "plan_liter",
            "actual_liter",
            "total_kelebihan",
            "alokasi_backcharge",
            "harga_per_liter",
            "nilai_backcharge",
          ],
          "berita_acara_id"
        );

        const findGoods = await Goods.findOne({
          where: { name: "Backcharge Fuel" },
          transaction: t,
        });

        const findSatuan = await Satuan.findOne({
          where: { name: "LITER" },
          transaction: t,
        });

        if (findGoods && plan_alokasi_periode?.length > 0) {
          const uraianData = plan_alokasi_periode.map((periode) => ({
            berita_acara_id: id,
            goods_id: findGoods.id,
            quantity: periode.alokasi_backcharge,
            harga: periode.harga_per_liter,
            total: periode.nilai_backcharge,
            satuan: findSatuan?.name,
            keterangan: periode.plan_alokasi_periode,
          }));

          await syncItems(
            Berita_Acara_Uraian,
            uraianData,
            ["goods_id", "quantity", "harga", "total", "satuan"],
            "berita_acara_id"
          );
        }
      }

      // 🔹 Non-trade + Non-fuel
      else if (isNonTrade && !isFuel) {
        await syncItems(
          Berita_Acara_Uraian,
          berita_acara_uraian,
          ["goods_id", "satuan", "quantity"],
          "berita_acara_id"
        );
      }

      // 🔹 Trade
      else if (isTrade) {
        await syncItems(
          Berita_Acara_Uraian,
          berita_acara_uraian,
          ["goods_id", "satuan", "quantity", "harga", "total", "description"],
          "berita_acara_id"
        );
      }

      // 🔹 Ambil data hasil akhir
      const updated = await Berita_Acara.findByPk(id, {
        include: [
          { model: Berita_Acara_Periode, as: "plan_alokasi_periode" },
          { model: Berita_Acara_Uraian, as: "berita_acara_uraian" },
          { model: Debit_Note, as: "debit_note" },
        ],
        transaction: t,
      });

      await t.commit();
      return res.status(200).json({
        status: "success",
        message: "Berita Acara updated successfully",
        data: updated,
      });
    } catch (error) {
      await t.rollback();
      console.error("❌ Error updateBeritaAcara:", error);
      return res.status(500).json({
        status: "error",
        message: error.message || "Internal server error",
      });
    }
  }

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

      await Berita_Acara_Uraian.destroy({
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

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { revised, status } = req.body;

      const findBeritaAcara = await Berita_Acara.findByPk(id);
      if (!findBeritaAcara) {
        return res.status(404).json({
          status: "error",
          message: "Berita acara tidak ditemukan",
        });
      }

      if (revised && !status) {
        await findBeritaAcara.update({ revised });
      } else {
        await findBeritaAcara.update({ revised: null });
      }

      if (status && !revised) {
        await findBeritaAcara.update({ status });
      }

      return res.status(200).json({
        status: "success",
        message: "Status Berita Acara berhasil diubah",
        data: findBeritaAcara,
      });
    } catch (error) {
      console.error("Error updateStatus:", error);
      return res.status(500).json({
        status: "error",
        message: error.message || "Internal server error",
      });
    }
  }
}

module.exports = BeritaAcaraController;
