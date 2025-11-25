import { TBeritaAcaraList, TBeritaAcaraUraian } from "../berita-acara/types";

export type TTemplateDebitNote = {
  id: string;
  debit_note_id: string;
  html_rendered: string;
};

export type TDebitNoteList = {
  id: string;
  berita_acara_id: string;
  debit_note_number: string;
  dpp_nilai_lain_fk: string;
  batas_akhir: string;
  uraian: TBeritaAcaraUraian[];
  sub_total: string;
  ppn: string;
  total: string;
  berita_acara: TBeritaAcaraList;
  createdAt: string;
  updatedAt: string;
  template_debit_note: TTemplateDebitNote;
};
