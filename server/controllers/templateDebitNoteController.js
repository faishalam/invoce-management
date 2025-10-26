const {
  Template,
  Berita_Acara,
  Customer,
  Template_Debit_Note,
  Debit_Note,
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
            attributes: ["customer_id", "number"],
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
        findDebitNote?.berita_acara?.customer_id
      );

      if (!findCustomer) {
        return res.status(404).json({
          status: "error",
          message: "Customer not found",
        });
      }

      const baseDataTemplate = {
        logo_url: "https://career.kppmining.com/logo.svg",
        number_debit_note: findDebitNote.debit_note_number,
        nama_customer: findCustomer.name,
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
        uraian: findDebitNote.uraian.map((item, i) => ({
          no: i + 1,
          nama_uraian: item.uraian,
          satuan: item.satuan,
          volume: item.volume,
          harga: `Rp ${Number(item.harga).toLocaleString("id-ID")}`,
          jumlah: `Rp ${Number(item.jumlah).toLocaleString("id-ID")}`,
        })),
        sub_total: `Rp ${Number(findDebitNote.sub_total).toLocaleString(
          "id-ID"
        )}`,
        ppn: `${findDebitNote.ppn}%`,
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
        where: {
          id: id,
        },
        include: [
          {
            model: Berita_Acara,
            as: "berita_acara",
            attributes: ["customer_id", "number"],
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
        where: {
          debit_note_id: id,
        },
      });

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
        findDebitNote.berita_acara.customer_id
      );

      if (!findCustomer) {
        return res.status(404).json({
          status: "error",
          message: "Customer not found",
        });
      }

      const baseDataTemplate = {
        logo_url: "https://career.kppmining.com/logo.svg",
        number_debit_note: findDebitNote.debit_note_number,
        nama_customer: findCustomer.name,
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
        uraian: findDebitNote.uraian.map((item, i) => ({
          no: i + 1,
          nama_uraian: item.uraian,
          satuan: item.satuan,
          volume: item.volume,
          harga: `Rp ${Number(item.harga).toLocaleString("id-ID")}`,
          jumlah: `Rp ${Number(item.jumlah).toLocaleString("id-ID")}`,
        })),
        sub_total: `Rp ${Number(findDebitNote.sub_total).toLocaleString(
          "id-ID"
        )}`,
        ppn: `${findDebitNote.ppn}%`,
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
