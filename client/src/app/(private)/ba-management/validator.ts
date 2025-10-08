import { z } from "zod";

export const beritaAcaraPeriodeSchema = z.object({
  planAlokasiPeriode: z.string().min(1, "Plan Alokasi Periode wajib diisi"),
  harga_per_liter: z.string().min(1, "Harga per liter wajib diisi"),
  plan_liter: z.string().optional(),
  actual_liter: z.string().optional(),
  total_kelebihan: z.string().optional(),
  alokasi_backcharge: z.string().optional(),
  nilai_backcharge: z.string().optional(),
});

export const createBeritaAcaraSchema = z
  .object({
    jenis_berita_acara: z.string().min(1, "Jenis Berita Acara wajib dipilih"),

    tipe_transaksi: z.string().min(1, "Jenis Berita Acara wajib dipilih"),

    customer_id: z.string().min(1, "Customer wajib diisi"),

    periode: z.string().nullable().optional(),
    cut_off: z.string().nullable().optional(),
    tipe_customer: z.string().nullable().optional(),
    type_of_work_id: z.string().nullable().optional(),
    reguler: z.string().nullable().optional(),
    pic: z.string().min(1, "PIC wajib diisi"),
    submitted_at: z.string().nullable().optional(),
    nill_ditagihkan: z.string().nullable().optional(),

    goods_id: z.string().nullable().optional(),
    quantity: z.string().nullable().optional(),
    satuan_id: z.string().nullable().optional(),
    alokasi_backcharge_total: z.string().nullable().optional(),

    planAlokasiPeriode: z.array(beritaAcaraPeriodeSchema).optional(),
  })
  .superRefine((data, ctx) => {
    // 🔹 Jika non-fuel → periode & cut_off wajib
    if (data.jenis_berita_acara !== "fuel") {
      if (!data.periode) {
        ctx.addIssue({
          path: ["periode"],
          message: "Periode wajib diisi untuk non-fuel",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.cut_off) {
        ctx.addIssue({
          path: ["cut_off"],
          message: "Cut off wajib diisi untuk non-fuel",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    // 🔹 Jika fuel → wajib isi array planAlokasiPeriode minimal 1
    if (data.jenis_berita_acara === "fuel") {
      if (
        !Array.isArray(data.planAlokasiPeriode) ||
        data.planAlokasiPeriode.length === 0
      ) {
        ctx.addIssue({
          path: ["planAlokasiPeriode"],
          message: "Plan Alokasi Periode wajib diisi untuk fuel",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    // 🔹 Jika nontrade dan non-fuel → wajib isi goods_id, quantity, satuan_id
    if (
      data.tipe_transaksi === "nontrade" &&
      data.jenis_berita_acara !== "fuel"
    ) {
      if (!data.goods_id) {
        ctx.addIssue({
          path: ["goods_id"],
          message: "Goods wajib diisi untuk Nontrade Non-Fuel",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.quantity) {
        ctx.addIssue({
          path: ["quantity"],
          message: "Quantity wajib diisi untuk Nontrade Non-Fuel",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.satuan_id) {
        ctx.addIssue({
          path: ["satuan_id"],
          message: "Satuan wajib diisi untuk Nontrade Non-Fuel",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type TBeritaAcaraForm = z.infer<typeof createBeritaAcaraSchema>;
