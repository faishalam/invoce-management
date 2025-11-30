const {
  Template,
  Berita_Acara,
  Customer,
  Template_Debit_Note,
  Debit_Note,
  Berita_Acara_Uraian,
  Goods,
} = require("../models");
const Mustache = require("mustache");
const { v4: uuidv4 } = require("uuid");

class TemplateBeritaAcaraController {
  static async createTemplateDebitNote(req, res) {
    try {
      const { berita_acara_id, id } = req.body;

      const findDebitNote = await Debit_Note.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: Berita_Acara,
            as: "berita_acara",
            attributes: [
              "customer_id",
              "number",
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

      if (!findDebitNote) {
        return res.status(404).json({
          status: "error",
          message: "Debit Note not found",
        });
      }

      const findTemplate = await Template.findOne({
        where: {
          code: "DEBIT-NOTE",
        },
      });

      if (!findTemplate) {
        return res.status(404).json({
          status: "error",
          message: "Template not found",
        });
      }

      const findCustomer = await Customer.findByPk(
        findDebitNote?.berita_acara.customer_id
      );

      if (!findCustomer) {
        return res.status(404).json({
          status: "error",
          message: "Customer not found",
        });
      }

      const goodsList = await Goods.findAll({
        attributes: ["id", "name"],
        raw: true,
      });

      // buat map id → name
      const goodsMap = goodsList.reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {});

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

      const baseDataTemplate = {
        logo_url: "https://career.kppmining.com/logo.svg",
        number_debit_note: findDebitNote.debit_note_number,
        nama_customer: findCustomer.name,
        customer_code: findCustomer?.code,
        alamat_customer: findCustomer.alamat,
        tanggal: new Date(findDebitNote?.createdAt).toLocaleDateString(
          "id-ID",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        ),
        batas_akhir: new Date(findDebitNote.batas_akhir).toLocaleDateString(
          "id-ID",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        ),
        harga_terbilang: findDebitNote.harga_terbilang,
        uraian: findDebitNote.berita_acara?.berita_acara_uraian.map(
          (item, i) => {
            let periodeFormatted = "-";
            if (findDebitNote.berita_acara?.periode) {
              const periodeStr = findDebitNote.berita_acara?.periode
                .toString()
                .padStart(4, "0");
              const month = parseInt(periodeStr.slice(0, 2), 10);
              const year = parseInt("20" + periodeStr.slice(2), 10);
              const monthName = new Date(year, month - 1).toLocaleString(
                "id-ID",
                {
                  month: "long",
                }
              );
              periodeFormatted =
                monthName.charAt(0).toUpperCase() +
                monthName.slice(1) +
                ` ${year}`;
            }

            return {
              no: i + 1,
              nama_uraian: goodsMap[item.goods_id] || "-",
              satuan: item.satuan,
              volume: item.quantity,
              harga: `Rp ${Number(item.harga).toLocaleString("id-ID")}`,
              jumlah: `Rp ${Number(item.total).toLocaleString("id-ID")}`,
              periode: `${periodeFormatted} ${
                findDebitNote?.berita_acara?.jenis_berita_acara === "fuel"
                  ? ` : ${
                      item?.start_date
                        ? `${String(
                            new Date(item.start_date).getDate()
                          ).padStart(2, "0")}-${String(
                            new Date(item.start_date).getMonth() + 1
                          ).padStart(2, "0")}-${new Date(
                            item.start_date
                          ).getFullYear()}`
                        : "-"
                    } - ${
                      item?.end_date
                        ? `${String(new Date(item.end_date).getDate()).padStart(
                            2,
                            "0"
                          )}-${String(
                            new Date(item.end_date).getMonth() + 1
                          ).padStart(2, "0")}-${new Date(
                            item.end_date
                          ).getFullYear()}`
                        : "-"
                    }`
                  : ""
              }`,
            };
          }
        ),

        sub_total: `Rp ${Number(findDebitNote.sub_total).toLocaleString(
          "id-ID"
        )}`,
        ppn: `Rp ${Number(
          Math.round(
            (11 / 12) *
              findDebitNote.sub_total *
              (parseFloat(findDebitNote.ppn || 0) / 100)
          )
        ).toLocaleString("id-ID")}`,
        total: `Rp ${Number(findDebitNote.total).toLocaleString("id-ID")}`,
      };

      const renderedHTML = Mustache.render(
        findTemplate.content,
        baseDataTemplate
      );

      await Template_Debit_Note.create({
        id: uuidv4(),
        berita_acara_id: berita_acara_id,
        template_id: findTemplate.id,
        html_rendered: renderedHTML,
        debit_note_id: findDebitNote.id,
      });

      return res.status(201).json({
        status: "success",
        message: "Template Debit Note created successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async updateTemplateDebitNote(req, res) {
    try {
      const { id } = req.params;

      const findDebitNote = await Debit_Note.findOne({
        where: { id },
        include: [
          {
            model: Berita_Acara,
            as: "berita_acara",
            attributes: [
              "customer_id",
              "number",
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

      if (!findDebitNote) {
        return res.status(404).json({
          status: "error",
          message: "Debit Note not found",
        });
      }

      const findTemplateDebitNote = await Template_Debit_Note.findOne({
        where: { debit_note_id: id },
      });

      if (!findTemplateDebitNote) {
        return res.status(404).json({
          status: "error",
          message: "Template Debit Note record not found",
        });
      }

      const findTemplate = await Template.findOne({
        where: { code: "DEBIT-NOTE" },
      });

      if (!findTemplate) {
        return res.status(404).json({
          status: "error",
          message: "Template not found",
        });
      }

      const findCustomer = await Customer.findByPk(
        findDebitNote.berita_acara.customer_id
      );

      if (!findCustomer) {
        return res.status(404).json({
          status: "error",
          message: "Customer not found",
        });
      }

      const goodsList = await Goods.findAll({
        attributes: ["id", "name"],
        raw: true,
      });

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

      const goodsMap = goodsList.reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {});

      const baseDataTemplate = {
        logo_url: "https://career.kppmining.com/logo.svg",
        number_debit_note: findDebitNote.debit_note_number,
        nama_customer: findCustomer.name,
        customer_code: findCustomer?.code,
        alamat_customer: findCustomer.alamat,
        harga_terbilang: findDebitNote.harga_terbilang,
        tanggal: new Date(findDebitNote?.createdAt).toLocaleDateString(
          "id-ID",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        ),
        batas_akhir: new Date(findDebitNote.batas_akhir).toLocaleDateString(
          "id-ID",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        ),
        harga_terbilang: findDebitNote.harga_terbilang,
        uraian: findDebitNote.berita_acara?.berita_acara_uraian?.map(
          (item, i) => {
            let periodeFormatted = "-";
            if (findDebitNote.berita_acara.periode) {
              const periodeStr = findDebitNote.berita_acara.periode
                .toString()
                .padStart(4, "0");
              const month = parseInt(periodeStr.slice(0, 2), 10);
              const year = parseInt("20" + periodeStr.slice(2), 10);
              const monthName = new Date(year, month - 1).toLocaleString(
                "id-ID",
                {
                  month: "long",
                }
              );
              periodeFormatted =
                monthName.charAt(0).toUpperCase() +
                monthName.slice(1) +
                ` ${year}`;
            }
            return {
              no: i + 1,
              nama_uraian: goodsMap[item.goods_id] || "-",
              satuan: item.satuan,
              volume: item.quantity,
              harga: `Rp ${Number(item.harga).toLocaleString("id-ID")}`,
              jumlah: `Rp ${Number(item.total).toLocaleString("id-ID")}`,
              periode: `${periodeFormatted} ${
                findDebitNote?.berita_acara?.jenis_berita_acara === "fuel"
                  ? ` : ${
                      item?.start_date
                        ? `${String(
                            new Date(item.start_date).getDate()
                          ).padStart(2, "0")}-${String(
                            new Date(item.start_date).getMonth() + 1
                          ).padStart(2, "0")}-${new Date(
                            item.start_date
                          ).getFullYear()}`
                        : "-"
                    } - ${
                      item?.end_date
                        ? `${String(new Date(item.end_date).getDate()).padStart(
                            2,
                            "0"
                          )}-${String(
                            new Date(item.end_date).getMonth() + 1
                          ).padStart(2, "0")}-${new Date(
                            item.end_date
                          ).getFullYear()}`
                        : "-"
                    }`
                  : ""
              }`,
            };
          }
        ),
        sub_total: `Rp ${Number(findDebitNote.sub_total).toLocaleString(
          "id-ID"
        )}`,
        ppn: `Rp ${Number(
          Math.round(
            (11 / 12) *
              findDebitNote.sub_total *
              (parseFloat(findDebitNote.ppn || 0) / 100)
          )
        ).toLocaleString("id-ID")}`,

        total: `Rp ${Number(findDebitNote.total).toLocaleString("id-ID")}`,
      };

      const renderedHTML = Mustache.render(
        findTemplate.content,
        baseDataTemplate
      );

      await findTemplateDebitNote.update({
        template_id: findTemplate.id,
        berita_acara_id: findTemplateDebitNote.berita_acara_id,
        html_rendered: renderedHTML,
      });

      return res.status(200).json({
        status: "success",
        message: "Template Debit Note updated successfully",
        data: {
          id: findTemplateDebitNote.id,
          template_id: findTemplate.id,
          berita_acara_id: findTemplateDebitNote.berita_acara_id,
        },
      });
    } catch (error) {
      console.error("❌ Error updateTemplateDebitNote:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = TemplateBeritaAcaraController;
