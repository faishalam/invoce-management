const {
  Template,
  Berita_Acara,
  Template_Berita_Acara,
  Customer,
  TypeOfWork,
  Berita_Acara_Periode,
  Berita_Acara_General,
  Goods,
} = require("../models");
const Mustache = require("mustache");
const { v4: uuidv4 } = require("uuid");

class TemplateBeritaAcaraController {
  static async createTemplateBeritaAcara(req, res) {
    try {
      const { berita_acara_id } = req.body;

      const findBeritaAcara = await Berita_Acara.findByPk(berita_acara_id, {
        include: [
          { model: Berita_Acara_Periode, as: "plan_alokasi_periode" },
          { model: Template_Berita_Acara, as: "template_berita_acara" },
          { model: Berita_Acara_General, as: "berita_acara_general" },
        ],
      });

      if (!findBeritaAcara) {
        return res.status(404).json({
          status: "error",
          message: "Berita Acara not found",
        });
      }

      let code;
      if (
        findBeritaAcara.tipe_transaksi === "nontrade" &&
        findBeritaAcara.jenis_berita_acara === "nonfuel"
      ) {
        code = "BA-GENERAL";
      } else if (
        findBeritaAcara.tipe_transaksi === "nontrade" &&
        findBeritaAcara.jenis_berita_acara === "fuel"
      ) {
        code = "BA-FUEL";
      }

      const template = await Template.findOne({
        where: {
          code: code,
        },
      });

      if (!template) {
        return res.status(404).json({
          status: "error",
          message: "Template not found",
        });
      }

      const dayNames = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];
      const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];

      const submittedDate = new Date(findBeritaAcara.submitted_at);
      const day = submittedDate.getDate().toString().padStart(2, "0");
      const month = submittedDate.getMonth();
      const year = submittedDate.getFullYear();
      const dayName = dayNames[submittedDate.getDay()];
      const monthName = monthNames[month];
      const find_customer = await Customer.findByPk(
        findBeritaAcara.customer_id
      );

      let baseDataTemplate = {};

      if (code === "BA-GENERAL") {
        const generalItems = findBeritaAcara?.berita_acara_general || [];
        const find_type_of_work = await TypeOfWork.findByPk(
          findBeritaAcara.type_of_work_id
        );
        let goodsMap = {};
        const goodsIds = generalItems.map((i) => i.goods_id).filter(Boolean);

        if (goodsIds.length > 0) {
          const goodsList = await Goods.findAll({ where: { id: goodsIds } });
          goodsMap = goodsList.reduce((acc, g) => {
            acc[g.id] = g;
            return acc;
          }, {});
        }

        baseDataTemplate = {
          hari: dayName,
          tanggal_lengkap: `${day} ${monthName} ${year}`,
          jenis_pekerjaan: find_type_of_work?.name || "-",
          number: findBeritaAcara?.number,
          logo_url: "https://career.kppmining.com/logo.svg",
          customer: find_customer?.name || "-",
          pic: findBeritaAcara?.pic,
          items: generalItems?.map((item, index) => {
            const g = goodsMap[item.goods_id];
            return {
              no: index + 1,
              nama_barang: g?.name || "-",
              kode: g?.code || "-",
              qty_drum: item.satuan,
              qty_liter: item.quantity,
            };
          }),
        };
      }

      if (code === "BA-FUEL") {
        const periodeRaw = findBeritaAcara?.periode;
        let periodeFormatted = "-";

        if (periodeRaw && periodeRaw.length === 4) {
          const bulan = parseInt(periodeRaw.slice(0, 2), 10) - 1;
          const tahun = "20" + periodeRaw.slice(2);
          periodeFormatted = `${monthNames[bulan]} ${tahun}`;
        }

        const planAlokasi = findBeritaAcara?.plan_alokasi_periode || [];

        baseDataTemplate = {
          logo_url: "https://career.kppmining.com/logo.svg",
          periode: periodeFormatted,
          number: findBeritaAcara?.number,
          customer: find_customer?.name || "-",
          plan_kontrak: planAlokasi.map((item, index) => ({
            periode: `Periode ${index + 1}`,
            harga_per_liter: item?.harga_per_liter,
            plan: item.plan_liter,
            actual: item.actual_liter,
          })),
          total_kelebihan: planAlokasi?.[0]?.total_kelebihan || 0,
          alokasi_backcharge: planAlokasi.map((item, index) => ({
            periode: `Periode ${index + 1}`,
            harga_per_liter: item?.harga_per_liter,
            alokasi_liter: item.alokasi_backcharge,
            nilai_backcharge: item.nilai_backcharge,
          })),
          total_plan: planAlokasi.reduce(
            (t, i) => t + Number(i.plan_liter || 0),
            0
          ),
          total_actual: planAlokasi.reduce(
            (t, i) => t + Number(i.actual_liter || 0),
            0
          ),
          total_nilai_backcharge: `Rp ${planAlokasi
            .reduce(
              (t, i) =>
                t +
                Number(
                  String(i.nilai_backcharge || "0").replace(/[^0-9]/g, "")
                ),
              0
            )
            .toLocaleString("id-ID")}`,

          tanggal: `${day} ${monthName} ${year}`,
        };
      }

      const renderedHTML = Mustache.render(template.content, baseDataTemplate);

      await Template_Berita_Acara.create({
        id: uuidv4(),
        template_id: template.id,
        berita_acara_id,
        html_rendered: renderedHTML,
      });

      return res.status(201).json({
        status: "success",
        message: "Template Berita Acara created successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async updateTemplateBeritaAcara(req, res) {
    try {
      const { id } = req.params;

      // ✅ 1. Cari Berita Acara dengan relasi
      const findBeritaAcara = await Berita_Acara.findByPk(id, {
        include: [
          { model: Berita_Acara_Periode, as: "plan_alokasi_periode" },
          { model: Template_Berita_Acara, as: "template_berita_acara" },
          { model: Berita_Acara_General, as: "berita_acara_general" },
        ],
      });

      if (!findBeritaAcara) {
        return res.status(404).json({
          status: "error",
          message: "Berita Acara not found",
        });
      }

      // ✅ 2. Cari Template Berita Acara yang sudah ada
      const existingTemplate = await Template_Berita_Acara.findOne({
        where: {
          berita_acara_id: id,
        },
      });

      if (!existingTemplate) {
        return res.status(404).json({
          status: "error",
          message: "Template Berita Acara not found",
        });
      }

      // ✅ 3. Tentukan code berdasarkan tipe_transaksi & jenis_berita_acara (SAMA SEPERTI CREATE)
      let code;
      if (
        findBeritaAcara.tipe_transaksi === "nontrade" &&
        findBeritaAcara.jenis_berita_acara === "nonfuel"
      ) {
        code = "BA-GENERAL";
      } else if (
        findBeritaAcara.tipe_transaksi === "nontrade" &&
        findBeritaAcara.jenis_berita_acara === "fuel"
      ) {
        code = "BA-FUEL";
      }

      // ✅ 4. Cari Template master berdasarkan code
      const template = await Template.findOne({
        where: {
          code: code,
        },
      });

      if (!template) {
        return res.status(404).json({
          status: "error",
          message: "Template not found",
        });
      }

      // ================== 📅 Setup nama hari & bulan ===================
      const dayNames = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];
      const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];

      const submittedDate = new Date(findBeritaAcara.submitted_at);
      const day = submittedDate.getDate().toString().padStart(2, "0");
      const month = submittedDate.getMonth();
      const year = submittedDate.getFullYear();
      const dayName = dayNames[submittedDate.getDay()];
      const monthName = monthNames[month];

      const find_customer = await Customer.findByPk(
        findBeritaAcara.customer_id
      );

      let baseDataTemplate = {};

      // ✅ 5. BA-GENERAL (SAMA SEPERTI CREATE)
      if (code === "BA-GENERAL") {
        const generalItems = findBeritaAcara?.berita_acara_general || [];
        const find_type_of_work = await TypeOfWork.findByPk(
          findBeritaAcara.type_of_work_id
        );
        let goodsMap = {};
        const goodsIds = generalItems.map((i) => i.goods_id).filter(Boolean);

        if (goodsIds.length > 0) {
          const goodsList = await Goods.findAll({ where: { id: goodsIds } });
          goodsMap = goodsList.reduce((acc, g) => {
            acc[g.id] = g;
            return acc;
          }, {});
        }

        baseDataTemplate = {
          hari: dayName,
          tanggal_lengkap: `${day} ${monthName} ${year}`,
          jenis_pekerjaan: find_type_of_work?.name || "-",
          number: findBeritaAcara?.number,
          logo_url: "https://career.kppmining.com/logo.svg",
          customer: find_customer?.name || "-",
          pic: findBeritaAcara?.pic,
          items: generalItems?.map((item, index) => {
            const g = goodsMap[item.goods_id];
            return {
              no: index + 1,
              nama_barang: g?.name || "-",
              kode: g?.code || "-",
              qty_drum: item.satuan,
              qty_liter: item.quantity,
            };
          }),
        };
      }

      // ✅ 6. BA-FUEL (SAMA SEPERTI CREATE)
      if (code === "BA-FUEL") {
        const periodeRaw = findBeritaAcara?.periode;
        let periodeFormatted = "-";

        if (periodeRaw && periodeRaw.length === 4) {
          const bulan = parseInt(periodeRaw.slice(0, 2), 10) - 1;
          const tahun = "20" + periodeRaw.slice(2);
          periodeFormatted = `${monthNames[bulan]} ${tahun}`;
        }

        const planAlokasi = findBeritaAcara?.plan_alokasi_periode || [];

        baseDataTemplate = {
          logo_url: "https://career.kppmining.com/logo.svg",
          periode: periodeFormatted,
          number: findBeritaAcara?.number,
          customer: find_customer?.name || "-",
          plan_kontrak: planAlokasi.map((item, index) => ({
            periode: `Periode ${index + 1}`,
            harga_per_liter: item?.harga_per_liter,
            plan: item.plan_liter,
            actual: item.actual_liter,
          })),
          total_kelebihan: planAlokasi?.[0]?.total_kelebihan || 0,
          alokasi_backcharge: planAlokasi.map((item, index) => ({
            periode: `Periode ${index + 1}`,
            harga_per_liter: item?.harga_per_liter,
            alokasi_liter: item.alokasi_backcharge,
            nilai_backcharge: item.nilai_backcharge,
          })),
          total_plan: planAlokasi.reduce(
            (t, i) => t + Number(i.plan_liter || 0),
            0
          ),
          total_actual: planAlokasi.reduce(
            (t, i) => t + Number(i.actual_liter || 0),
            0
          ),
          total_nilai_backcharge: `Rp ${planAlokasi
            .reduce(
              (t, i) =>
                t +
                Number(
                  String(i.nilai_backcharge || "0").replace(/[^0-9]/g, "")
                ),
              0
            )
            .toLocaleString("id-ID")}`,
          tanggal: `${day} ${monthName} ${year}`,
        };
      }

      // ✅ 7. Render HTML dengan Mustache
      const renderedHTML = Mustache.render(template.content, baseDataTemplate);

      // ✅ 8. Update template yang sudah ada
      await existingTemplate.update({
        template_id: template.id,
        html_rendered: renderedHTML,
        updatedAt: new Date(),
      });

      return res.status(200).json({
        status: "success",
        message: "Template Berita Acara updated successfully",
        data: {
          id: existingTemplate.id,
          berita_acara_id: id,
          template_id: template.id,
        },
      });
    } catch (error) {
      console.error("❌ Error updateTemplateBeritaAcara:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = TemplateBeritaAcaraController;
