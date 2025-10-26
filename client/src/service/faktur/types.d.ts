import { TBeritaAcaraList } from "../berita-acara/types";
import { TDebitNoteList } from "../debit-note/types";

export type TUraian = {
  uraian: string;
  satuan: string;
  volume: string;
  harga: string;
  jumlah: string;
  dpp_nilai_lain_of: string;
  jumlah_ppn_of: string;
};

export type TFakturList = {
  id?: string;
  nomor_seri_faktur: string;
  masa_pajak: string;
  tahun: string;
  npwp: string;
  customer_id: string;
  sub_total: string;
  dpp_nilai_lain_fk: string;
  ppn_fk: string;
  jumlah_ppn_fk: string;
  kode_objek: string;
  uraian: TUraian[];
  ppn_of: string;
  berita_acara: TBeritaAcaraList;
  debit_note: TDebitNoteList;
};
