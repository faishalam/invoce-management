"use client";
import { useEffect } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { Button } from "@mui/material";
import useBeritaAcara from "../hooks";
import IdentifyForm from "./components/IdentifyForm";
import InformationForm from "./components/InformationForm";
import PlanAlokasiForm from "./components/PlanAlokasiForm";
import BackchargeForm from "./components/BackchargeForm";
import ModalViewDocument from "./components/ModalVIewDocument";
import BeritaAcaraSkeleton from "./components/loadingSkeleton";
import { BlockingLoader } from "@/components/atoms/loader";
import Signer from "./components/Signer";
import ModalRevised from "./components/ModalRevised";
import useGlobal from "../../hooks";
import ModalDelivery from "./components/ModalDelivery";

export default function Page() {
  const {
    handleSubmit,
    watch,
    setValue,
    onSubmit,
    setOpenModalRevised,
    onInvalid,
    openModalDelivery,
    mode,
    setOpenModalDocument,
    openModalDocument,
    isLoadingDataBeritaAcaraById,
    isLoadingCreateBeritaAcara,
    isLoadingUpdateBeritaAcara,
    dataBeritaAcaraById,
    openModalRevised,
    setOpenModalDelivery,
  } = useBeritaAcara();
  const tipeTransaksi = watch("tipe_transaksi");
  const jenisBeritaAcara = watch("jenis_berita_acara");
  const { dataUserProfile } = useGlobal();

  useEffect(() => {
    if (tipeTransaksi === "nontrade") {
      if (jenisBeritaAcara === "fuel") {
        setValue("berita_acara_uraian", []);
      }
      if (jenisBeritaAcara === "nonfuel") {
        setValue("plan_alokasi_periode", []);
      }
    }
    if (tipeTransaksi === "trade") {
      setValue("berita_acara_uraian", []);
      setValue("plan_alokasi_periode", []);
    }
  }, [tipeTransaksi, jenisBeritaAcara]);

  return (
    <div className="w-full">
      {(isLoadingCreateBeritaAcara || isLoadingUpdateBeritaAcara) && (
        <BlockingLoader />
      )}

      <div className="Berita Acara text-2xl mb-8 flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-2xl font-bold">Berita Acara</p>
          <p className="text-sm text-gray-600">Kelola Berita Acara Dokumen</p>
        </div>
        {mode === "view" && (
          <>
            <div className="flex gap-2">
              {dataBeritaAcaraById?.data?.status === "Done" &&
                dataBeritaAcaraById?.data?.tipe_transaksi === "nontrade" && (
                  <Button
                    className="!bg-purple-600 hover:!bg-purple-700"
                    variant="contained"
                    onClick={() => {
                      setOpenModalDelivery(true);
                    }}
                  >
                    Pengiriman
                  </Button>
                )}

              <Button
                color="secondary"
                variant="contained"
                className="!bg-yellow-500 hover:!bg-yellow-600"
                disabled={
                  dataBeritaAcaraById?.data?.revised !== null ||
                  dataUserProfile?.data?.department !== "FAT" ||
                  dataBeritaAcaraById?.data?.status === "Cancelled"
                }
                onClick={() => {
                  setOpenModalRevised(true);
                }}
              >
                Revised
              </Button>

              <Button
                color="secondary"
                variant="contained"
                disabled={!dataBeritaAcaraById?.data?.link_doc}
                onClick={() => {
                  const link = dataBeritaAcaraById?.data?.link_doc;
                  if (link) {
                    window.open(link, "_blank");
                  }
                }}
              >
                Signed Dokumen
              </Button>

              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  setOpenModalDocument(true);
                }}
              >
                Lihat Document
              </Button>
            </div>
          </>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="flex flex-col gap-6"
      >
        {isLoadingDataBeritaAcaraById && mode !== "create" ? (
          <BeritaAcaraSkeleton />
        ) : (
          <>
            {dataBeritaAcaraById?.data?.status === "Cancelled" && (
              <div className="w-full bg-red-100 text-red-600 border border-red-600 rounded-md text-sm p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <ErrorOutlineIcon fontSize="small" />
                    <p>*Alasan Cancel</p>
                  </div>
                  <p>{dataBeritaAcaraById?.data?.cancelled?.reason}</p>
                </div>
              </div>
            )}

            {dataBeritaAcaraById?.data?.revised?.status === "Revised" && (
              <div className="w-full bg-yellow-50 text-yellow-500 border border-yellow-500 rounded-md text-sm p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <ErrorOutlineIcon fontSize="small" />
                    <p>*Alasan Revisi</p>
                  </div>
                  <p>{dataBeritaAcaraById?.data?.revised?.reason}</p>
                </div>
              </div>
            )}

            <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
              <IdentifyForm />
            </div>
            <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
              <InformationForm />
            </div>

            {tipeTransaksi === "nontrade" && jenisBeritaAcara === "nonfuel" && (
              <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
                <PlanAlokasiForm />
              </div>
            )}
            {jenisBeritaAcara === "fuel" && tipeTransaksi === "nontrade" && (
              <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
                <BackchargeForm />
              </div>
            )}
            {tipeTransaksi === "nontrade" && (
              <div className="bg-white w-full rounded-md shadow flex flex-col p-6 gap-8">
                <Signer />
              </div>
            )}

            <div className="flex justify-end pt-6 gap-2">
              <Button
                variant="outlined"
                color="secondary"
                type="button"
                onClick={() => window.history.back()}
              >
                Kembali
              </Button>
              {mode !== "view" && (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  // disabled={isExceedingLimit || !hasKelebihan || sisaAlokasi !== 0}
                >
                  Simpan Berita Acara
                </Button>
              )}
            </div>
          </>
        )}
      </form>
      {openModalDocument && <ModalViewDocument />}
      {openModalRevised && <ModalRevised />}
      {openModalDelivery && <ModalDelivery />}
    </div>
  );
}
