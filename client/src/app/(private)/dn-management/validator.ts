import { z } from "zod";

export const uraianItemSchema = z.object({
  uraian: z.string().nonempty("Uraian wajib diisi"),
  satuan: z.string().nonempty("Satuan wajib diisi"),
  volume: z.string().nonempty("Volume wajib diisi"),
  harga: z.string().nonempty("Harga wajib diisi"),
  jumlah: z.string().nonempty("Jumlah wajib diisi"),
});

export const debitNoteSchema = z.object({
  berita_acara_id: z.string().nonempty("ID Berita Acara wajib diisi"),
  uraian: z.array(uraianItemSchema).min(1, "Minimal satu uraian harus diisi"),
  sub_total: z.string().nonempty("Subtotal wajib diisi"),
  ppn: z.string().nonempty("PPN wajib diisi"),
  total: z.string().nonempty("Total wajib diisi"),
});

export type TDebitNoteForm = z.infer<typeof debitNoteSchema>;
