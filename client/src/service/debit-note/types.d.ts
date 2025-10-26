import { TBeritaAcaraList } from "../berita-acara/types";

export type TUraianDebitNote = {
  uraian: string;
  satuan: string;
  volume: string;
  harga: string;
  jumlah: string;
};

export type TTemplateDebitNote = {
  id: string;
  debit_note_id: string;
  html_rendered: string;
};

export type TDebitNoteList = {
  id: string;
  berita_acara_id: string;
  debit_note_number: string;
  batas_akhir: string;
  uraian: TUraianDebitNote[];
  sub_total: string;
  ppn: string;
  total: string;
  berita_acara: TBeritaAcaraList;
  createdAt: string;
  updatedAt: string;
  template_debit_note: TTemplateDebitNote;
};
