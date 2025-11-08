import { z } from "zod";

const uraianItemSchema = z.object({
  id: z.string().nonempty(),
  goods_id: z.string().nonempty({ message: "uraian is required" }),
  satuan: z.string().nonempty({ message: "satuan is required" }),
  quantity: z.string().nonempty({ message: "volume is required" }),
  harga: z.string().nonempty({ message: "harga is required" }),
  total: z.string().nonempty({ message: "jumlah is required" }),
  dpp_nilai_lain_of: z
    .string()
    .nonempty({ message: "dpp_nilai_lain_of is required" }),
  jumlah_ppn_of: z.string().nonempty({ message: "jumlah_ppn_of is required" }),
});

export const fakturSchema = z.object({
  berita_acara_id: z
    .string()
    .nonempty({ message: "berita_acara_id is required" }),
  debit_note_id: z.string().nonempty({ message: "debit_note_id is required" }),
  nomor_seri_faktur: z.string().optional(),
  masa_pajak: z.string().nonempty({ message: "masa_pajak is required" }),
  tahun: z.string().nonempty({ message: "tahun is required" }),
  npwp: z.string().nonempty({ message: "npwp is required" }),
  customer_id: z.string().nonempty({ message: "customer_id is required" }),
  sub_total: z.string().nonempty({ message: "sub_total is required" }),
  dpp_nilai_lain_fk: z
    .string()
    .nonempty({ message: "dpp_nilai_lain_fk is required" }),
  ppn_fk: z.string().nonempty({ message: "ppn_fk is required" }),
  jumlah_ppn_fk: z.string().nonempty({ message: "jumlah_ppn_fk is required" }),
  kode_objek: z.string().optional(),
  uraian: z
    .array(uraianItemSchema)
    .min(1, { message: "uraian must be a non-empty array" }),
  ppn_of: z.string().nonempty({ message: "ppn_of is required" }),
});

export const fakturSchemaAccepted = z.object({
  kode_objek: z.string().optional(),
  nomor_seri_faktur: z
    .string()
    .min(1, { message: "Nomor Seri Faktur wajib diisi" }),
});

export const fakturTransaction = z.object({
  transaction_id: z
    .string()
    .min(1, { message: "Nomor Seri Faktur wajib diisi" }),
});

export type TFakturForm = z.infer<typeof fakturSchema>;
export type TFakturFormAccepted = z.infer<typeof fakturSchemaAccepted>;
export type TFakturFormTransaction = z.infer<typeof fakturTransaction>;
