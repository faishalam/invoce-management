import { z } from "zod";

export const uraianItemSchema = z.object({
  id: z.string(),
  berita_acara_id: z.string(),
  goods_id: z.string(),
  satuan: z.string().optional(),
  quantity: z.string(),
  harga: z.string().optional(),
  total: z.string().optional(),
  dpp_nilai_lain_of: z.string().optional().nullable(),
  jumlah_ppn_of: z.string().optional().nullable(),
  periode: z.string().optional().nullable(),
});

export const debitNoteSchema = z.object({
  harga_terbilang: z.string().nonempty("Harga Terbilang wajib diisi"),
  berita_acara_id: z.string().nonempty("ID Berita Acara wajib diisi"),
  uraian: z.array(uraianItemSchema).min(1, "Minimal satu uraian harus diisi"),
  sub_total: z.string().nonempty("Subtotal wajib diisi"),
  ppn: z.string().nonempty("PPN wajib diisi"),
  total: z.string().nonempty("Total wajib diisi"),
});

export type TDebitNoteForm = z.infer<typeof debitNoteSchema>;
