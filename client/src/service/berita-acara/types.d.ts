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

export interface TBeritaAcaraList {
  id: string;
  tipe_transaksi: string;
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
  debit_note: { id: string };
}
