"use client";
import { useEffect } from "react";
import { Button } from "@mui/material";
import useBeritaAcara from "../hooks";
import IdentifyForm from "./components/IdentifyForm";
import InformationForm from "./components/InformationForm";
import PlanAlokasiForm from "./components/PlanAlokasiForm";
import BackchargeForm from "./components/BackchargeForm";
import ModalViewDocument from "./components/ModalVIewDocument";
import BeritaAcaraSkeleton from "./components/loadingSkeleton";
import { BlockingLoader } from "@/components/atoms/loader";

export default function Page() {
  const {
    handleSubmit,
    watch,
    setValue,
    onSubmit,
    onInvalid,
    mode,
    setOpenModalDocument,
    openModalDocument,
    isLoadingDataBeritaAcaraById,
    isLoadingCreateBeritaAcara,
    isLoadingUpdateBeritaAcara,
  } = useBeritaAcara();

  const tipeTransaksi = watch("tipe_transaksi");
  const jenisBeritaAcara = watch("jenis_berita_acara");

  useEffect(() => {
    if (tipeTransaksi === "nontrade") {
      if (jenisBeritaAcara === "fuel") {
        setValue("berita_acara_general", []);
      }
      if (jenisBeritaAcara === "nonfuel") {
        setValue("plan_alokasi_periode", []);
      }
    }
    if (tipeTransaksi === "trade") {
      setValue("berita_acara_general", []);
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
          <div>
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
            {mode !== "view" && (
              <div className="flex justify-end pt-6">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  // disabled={isExceedingLimit || !hasKelebihan || sisaAlokasi !== 0}
                >
                  Simpan Berita Acara
                </Button>
              </div>
            )}
          </>
        )}
      </form>
      {openModalDocument && <ModalViewDocument />}
    </div>
  );
}
