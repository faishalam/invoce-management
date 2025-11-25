import { TDeliveryForm } from "@/app/(private)/ba-management/validator";

export interface TBeritaAcaraPeriode {
  plan_alokasi_periode: string | null;
  total_kelebihan: string | null;
  harga_per_liter: string | null;
  plan_liter: string | null;
  actual_liter: string | null;
  alokasi_backcharge: string | null;
  nilai_backcharge: string | null;
}

export interface TTemplates {
  html_rendered: string;
}

export interface TBeritaAcaraUraian {
  id: string;
  berita_acara_id: string;
  goods_id: string;
  satuan: string;
  quantity: string;
  harga: string;
  total: string;
  start_date: string;
  end_date: string;
  dpp_nilai_lain_of?: null;
  jumlah_ppn_of?: null;
  periode?: null;
}

export interface TBeritaAcaraList {
  id: string;
  link_doc?: string;
  tipe_transaksi: string;
  accepted_at: string;
  jenis_berita_acara: string;
  number: string;
  site: string;
  periode: string;
  customer_id: string;
  cut_off: string;
  submitted_at: string;
  tipe_customer: string;
  reguler: string;
  pic: string;
  quantity: string | null;
  createdAt: string;
  nill_ditagihkan: string;
  goods: string | null;
  status: string;
  satuan: string | null;
  type_of_work_id: string;
  plan_alokasi_periode: TBeritaAcaraPeriode[];
  template_berita_acara: TTemplates;
  debit_note: { id: string; createdAt: string; debit_note_number: string };
  revised: {
    status: string;
    reason: string;
  };
  cancelled: {
    reason: string;
  };
  berita_acara_uraian: TBeritaAcaraUraian[];
  delivery: TDeliveryForm;
}
