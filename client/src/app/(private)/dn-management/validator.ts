import { z } from "zod";

export const uraianItemSchema = z.object({
  id: z.string(),
  berita_acara_id: z.string(),
  goods_id: z.string(),
  satuan: z.string().optional(),
  quantity: z.string(),
  harga: z.string().min(1, {message: 'harga wajib diisi'}),
  total: z.string().min(1, {message: 'total wajib diisi'}),
  dpp_nilai_lain_of: z.string().optional().nullable(),
  jumlah_ppn_of: z.string().optional().nullable(),
  periode: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
});

export const createDebitNoteSchema = (jenis_berita_acara: string) =>
  z.object({
    harga_terbilang: z.string().nonempty("Harga Terbilang wajib diisi"),
    berita_acara_id: z.string().nonempty("ID Berita Acara wajib diisi"),
    uraian: z
      .array(uraianItemSchema)
      .min(1, "Minimal satu uraian harus diisi")
      .superRefine((items, ctx) => {
        if (jenis_berita_acara === "fuel") {
          items.forEach((item, index) => {
            if (!item.start_date) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Start Date wajib diisi untuk jenis fuel",
                path: [index, "start_date"],
              });
            }
            if (!item.end_date) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "End Date wajib diisi untuk jenis fuel",
                path: [index, "end_date"],
              });
            }
          });
        }
      }),

    sub_total: z.string().nonempty("Subtotal wajib diisi"),
    ppn: z.string().nonempty("PPN wajib diisi"),
    total: z.string().nonempty("Total wajib diisi"),
    dpp_nilai_lain_fk: z.string().nonempty("Total wajib diisi"),
  });

export type TDebitNoteForm = z.infer<ReturnType<typeof createDebitNoteSchema>>;
