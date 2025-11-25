"use client";
import { Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import useDebitNote from "../hooks";
import { CInput } from "@/components/atoms";
import { TextArea } from "@/components/atoms/Input-text-area";
import useGlobal from "@/app/(private)/hooks";
import UraianSection from "./components/uraianForm";
import { useMemo } from "react";
import ModalViewDocument from "./components/ModalViewDocument";
import DebitNoteSkeleton from "./components/LoadingSkeleton";
import { BlockingLoader } from "@/components/atoms/loader";

export default function Page() {
  const {
    setOpenModalDocument,
    openModalDocument,
    mode,
    handleSubmit,
    onSubmit,
    onInvalid,
    dataBeritaAcaraById,
    dataDebitNoteById,
    isLoadingDebitNoteById,
    isLoadingCreateDebitNote,
    isLoadingUpdateDebitNote,
    isLoadingDataBeritaAcaraById,
  } = useDebitNote();

  const { dataCustomer } = useGlobal();

  const customer = useMemo(() => {
    if (mode === "create") {
      return dataCustomer?.data?.find(
        (customer) => customer.id === dataBeritaAcaraById?.data?.customer_id
      );
    }

    if (mode === "edit" || mode === "view") {
      return dataCustomer?.data?.find(
        (customer) =>
          customer.id === dataDebitNoteById?.data?.berita_acara?.customer_id
      );
    }
  }, [mode, dataDebitNoteById, dataBeritaAcaraById, dataCustomer]);

  return (
    <div className="w-full">
      {(isLoadingCreateDebitNote || isLoadingUpdateDebitNote) && (
        <BlockingLoader />
      )}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-2xl font-bold">Debit Note</p>
          <p className="text-sm text-gray-600">Kelola Debit Note Dokumen</p>
        </div>

        {mode === "view" && (
          <Button
            color="primary"
            variant="contained"
            onClick={() => setOpenModalDocument(true)}
          >
            Lihat Document
          </Button>
        )}
      </div>

      {(
        mode === "create"
          ? isLoadingDataBeritaAcaraById
          : isLoadingDebitNoteById
      ) ? (
        <DebitNoteSkeleton />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="flex flex-col gap-6"
        >
          <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
            <div className="flex items-center gap-2">
              <InfoIcon className="text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">
                Informasi Berita Acara
              </h2>
            </div>

            <div className="-mx-6 border-t border-gray-200" />

            <div className="flex flex-col gap-4">
              <div className="w-full flex gap-4 items-center">
                <CInput
                  label="Nomor BA*"
                  className="w-full"
                  type="text"
                  disabled
                  value={`${
                    mode === "create"
                      ? dataBeritaAcaraById?.data?.number
                      : dataDebitNoteById?.data?.berita_acara?.number
                  }`}
                  placeholder="Nomor BA"
                />
                <CInput
                  label="Nama Customer*"
                  className="w-full"
                  type="text"
                  disabled
                  value={customer?.name}
                  placeholder="Nama Customer"
                />
                <CInput
                  label="Kode Customer*"
                  className="w-full"
                  type="text"
                  disabled
                  value={customer?.code}
                  placeholder="Kode Customer"
                />
                <CInput
                  label="Nomor Telepon*"
                  className="w-full"
                  type="text"
                  disabled
                  value={customer?.phone}
                  placeholder="Nomor Telepon"
                />
                <CInput
                  label="Periode*"
                  className="w-full"
                  type="month"
                  disabled
                  value={
                    dataBeritaAcaraById?.data?.periode
                      ? `20${dataBeritaAcaraById?.data?.periode.slice(
                          2,
                          4
                        )}-${dataBeritaAcaraById?.data?.periode.slice(0, 2)}`
                      : ""
                  }
                />
              </div>

              {/* Alamat - Full Width */}
              <div className="md:col-span-2">
                <TextArea
                  label="Alamat Perusahaan*"
                  placeholder="Jl. Contoh No. Contoh"
                  className="w-full"
                  disabled
                  value={customer?.alamat}
                />
              </div>
            </div>
          </div>

          <UraianSection />

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outlined"
              color="secondary"
              type="button"
              onClick={() => window.history.back()}
            >
              Batal
            </Button>
            {mode !== "view" && (
              <Button variant="contained" color="primary" type="submit">
                Simpan Debit Note
              </Button>
            )}
          </div>
        </form>
      )}

      {openModalDocument && <ModalViewDocument />}
    </div>
  );
}
