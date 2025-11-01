import z from "zod";

export type TBeritaAcaraForm = {
  id?: string;
  tipe_transaksi: string;
  jenis_berita_acara: string;
  customer_id: string;
  periode: string;
  cut_off: string;
  submitted_at: string;
  tipe_customer: string;
  type_of_work_id: string;
  reguler: string;
  pic: string;
  nill_ditagihkan: string;
  berita_acara_uraian?: Array<{
    goods_id: string | null;
    satuan: string | null;
    quantity: string | null;
  }>;
  plan_alokasi_periode?: Array<{
    plan_alokasi_periode: string | null;
    total_kelebihan: string | null;
    harga_per_liter: string | null;
    plan_liter: string | null;
    actual_liter: string | null;
    alokasi_backcharge: string | null;
    nilai_backcharge: string | null;
  }>;
  signers?: Array<{
    name: string | null;
    dept: string | null;
  }>;
};

export type ValidationErrors = {
  [key: string]: string | ValidationErrors | ValidationErrors[];
};

export const validateBeritaAcara = (
  data: TBeritaAcaraForm
): { isValid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};

  // Validasi field wajib umum
  if (!data?.tipe_transaksi) {
    errors.tipe_transaksi = "Tipe Transaksi wajib diisi";
  }

  if (!data?.jenis_berita_acara) {
    errors.jenis_berita_acara = "Jenis Berita Acara wajib diisi";
  }

  if (!data?.customer_id) {
    errors.customer_id = "Customer wajib diisi";
  }

  if (!data?.periode) {
    errors.periode = "Periode wajib diisi";
  }

  if (!data?.cut_off) {
    errors.cut_off = "Cut Off wajib diisi";
  }

  if (!data?.submitted_at) {
    errors.submitted_at = "Submitted At wajib diisi";
  }

  if (!data?.tipe_customer) {
    errors.tipe_customer = "Tipe Customer wajib diisi";
  }

  if (!data?.type_of_work_id) {
    errors.type_of_work_id = "Type of Work wajib diisi";
  }

  if (!data?.reguler) {
    errors.reguler = "Reguler wajib diisi";
  }

  if (!data?.pic) {
    errors.pic = "PIC wajib diisi";
  }

  if (!data?.nill_ditagihkan) {
    errors.nill_ditagihkan = "Nilai/Ditagihkan wajib diisi";
  }

  // Validasi untuk Non-Trade Non-Fuel
  if (
    data?.tipe_transaksi === "nontrade" &&
    data.jenis_berita_acara === "nonfuel"
  ) {
    if (!data?.berita_acara_uraian || data?.berita_acara_uraian?.length === 0) {
      errors.berita_acara_uraian = "Minimal 1 Backcharge";
    } else {
      const generalErrors: ValidationErrors[] = [];

      data.berita_acara_uraian.forEach((general, index) => {
        const itemErrors: ValidationErrors = {};

        if (!general?.goods_id) {
          itemErrors.goods_name = "Jenis Backcharge wajib diisi";
        }

        if (!general?.quantity) {
          itemErrors.quantity = "Quantity wajib diisi";
        }

        if (!general?.satuan) {
          itemErrors.satuan = "Satuan wajib diisi";
        }

        if (Object.keys(itemErrors).length > 0) {
          generalErrors[index] = itemErrors;
        }
      });

      if (generalErrors.length > 0) {
        errors.berita_acara_uraian = generalErrors;
      }
    }
  }

  // Validasi untuk Non-Trade Fuel
  if (
    data?.tipe_transaksi === "nontrade" &&
    data.jenis_berita_acara === "fuel"
  ) {
    if (
      !data?.plan_alokasi_periode ||
      data?.plan_alokasi_periode?.length === 0
    ) {
      errors.plan_alokasi_periode = "Minimal 1 periode wajib diisi";
    } else {
      // Validasi setiap item dalam plan_alokasi_periode
      const periodeErrors: ValidationErrors[] = [];

      data.plan_alokasi_periode.forEach((periode, index) => {
        const itemErrors: ValidationErrors = {};

        if (!periode?.harga_per_liter) {
          itemErrors.harga_per_liter = "Harga Per Liter wajib diisi";
        }

        if (!periode?.plan_liter) {
          itemErrors.plan_liter = "Plan Liter wajib diisi";
        }

        if (!periode?.actual_liter) {
          itemErrors.actual_liter = "Actual Liter wajib diisi";
        }

        if (!periode?.alokasi_backcharge) {
          itemErrors.alokasi_backcharge = "Alokasi Backcharge wajib diisi";
        }

        if (!periode?.nilai_backcharge) {
          itemErrors.nilai_backcharge = "Nilai Backcharge wajib diisi";
        }

        // Hanya tambahkan jika ada error
        if (Object.keys(itemErrors).length > 0) {
          periodeErrors[index] = itemErrors;
        }
      });

      // Jika ada error pada periode, tambahkan ke errors
      if (periodeErrors.length > 0) {
        errors.plan_alokasi_periode = periodeErrors;
      }
    }
  }

  if (data?.tipe_transaksi === "nontrade") {
    if (!data?.signers || data.signers.length === 0) {
      errors.signers = "Signer wajib diisi";
    } else {
      const signerErrors: ValidationErrors[] = [];

      data.signers.forEach((signer, index) => {
        const itemErrors: ValidationErrors = {};

        if (!signer?.name) {
          itemErrors.name = "Nama signer wajib diisi";
        }

        if (!signer?.dept) {
          itemErrors.dept = "Departemen signer wajib diisi";
        }

        if (Object.keys(itemErrors).length > 0) {
          signerErrors[index] = itemErrors;
        }
      });

      if (signerErrors.length > 0) {
        errors.signers = signerErrors;
      }
    }
  }

  // Return hasil validasi
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const acceptedSchema = z.object({
  link_doc: z.string().min(1, { message: "Link Dokumen wajib diisi" }),
});

export type TAcceptedForm = z.infer<typeof acceptedSchema>;
