"use client";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";
import { CAutoComplete, CInput } from "@/components/atoms";
import { TextArea } from "@/components/atoms/Input-text-area";
import useGlobal from "@/app/(private)/hooks";
import { useEffect, useMemo } from "react";
import useFaktur from "../hooks";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { BlockingLoader } from "@/components/atoms/loader";

const formatCurrency = (value: string | number | undefined | null): string => {
  if (!value) return "";
  const numericValue = String(value).replace(/[^\d]/g, "");
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseCurrency = (value: string): number => {
  return Number(value?.replace(/\D/g, "") || 0);
};

const MASA_PAJAK_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `Masa ${i + 1}`,
}));

export default function Page() {
  const {
    mode,
    handleSubmit,
    onSubmit,
    onInvalid,
    dataDebitNoteById,
    dataFakturById,
    isLoadingDebitNoteById,
    isLoadingFakturById,
    control,
    errors,
    setValue,
    isLoadingUpdateFaktur,
    isLoadingCreateFaktur,
    onDownloadFaktur,
  } = useFaktur();
  const { fields } = useFieldArray({
    control,
    name: "uraian",
  });

  const { dataCustomer, dataSatuan, dataGoods } = useGlobal();

  const uraian = useWatch({ control, name: "uraian" });
  const ppnOf = useWatch({ control, name: "ppn_of" });

  useEffect(() => {
    if (!uraian) return;

    const ppnPersen = Number(ppnOf) || 0;

    uraian.forEach((item, index) => {
      const jumlah = Number(item?.total) || 0;
      const dpp = (jumlah * 11) / 12;
      const jumlahPpn = (dpp * ppnPersen) / 100;

      const currentDpp = Number(item?.dpp_nilai_lain_of) || 0;
      const currentJumlahPpn = Number(item?.jumlah_ppn_of) || 0;

      // Update DPP jika beda
      if (Math.round(dpp) !== Math.round(currentDpp)) {
        setValue(
          `uraian.${index}.dpp_nilai_lain_of`,
          Math.round(dpp).toString()
        );
      }

      // Update Jumlah PPN jika beda
      if (Math.round(jumlahPpn) !== Math.round(currentJumlahPpn)) {
        setValue(
          `uraian.${index}.jumlah_ppn_of`,
          Math.round(jumlahPpn).toString()
        );
      }
    });
  }, [ppnOf, uraian, setValue]);

  const customer = useMemo(() => {
    const customerData =
      mode === "create"
        ? dataDebitNoteById?.data?.berita_acara
        : dataFakturById?.data?.berita_acara;

    return dataCustomer?.data?.find(
      (customer) => customer.id === customerData?.customer_id
    );
  }, [mode, dataDebitNoteById, dataFakturById, dataCustomer]);

  const isViewMode = mode === "view";

  return (
    <div className="w-full">
      {(isLoadingUpdateFaktur || isLoadingCreateFaktur) && <BlockingLoader />}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-2xl font-bold">Faktur</p>
          <p className="text-sm text-gray-600">Kelola Data Faktur</p>
        </div>

        <Button
          onClick={() => {
            onDownloadFaktur();
          }}
          className=""
          color="primary"
          variant="contained"
        >
          <span>{<DownloadIcon />}</span>
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="flex flex-col gap-6"
      >
        <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
          <div className="flex items-center gap-2">
            <InfoIcon className="text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">
              Informasi Berita Acara dan Debit Note
            </h2>
          </div>

          {isLoadingDebitNoteById && isLoadingFakturById && <LoadingSkeleton />}

          <div className="-mx-6 border-t border-gray-200" />

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <CInput
                label="Nomor BA*"
                type="text"
                disabled
                value={
                  mode === "create"
                    ? dataDebitNoteById?.data?.berita_acara?.number
                    : dataFakturById?.data?.berita_acara?.number
                }
                placeholder="Nomor BA"
              />
              <CInput
                label="Nomor DN*"
                type="text"
                disabled
                value={
                  mode === "create"
                    ? dataDebitNoteById?.data?.debit_note_number
                    : dataFakturById?.data?.debit_note?.debit_note_number
                }
                placeholder="Nomor DN"
              />
              <CInput
                label="Nama Customer*"
                type="text"
                disabled
                value={customer?.name || "-"}
                placeholder="Nama Customer"
              />
              <CInput
                label="Kode Customer*"
                type="text"
                disabled
                value={customer?.code || "-"}
                placeholder="Kode Customer"
              />
              <CInput
                label="Nomor Telepon*"
                type="text"
                disabled
                value={customer?.phone || "-"}
                placeholder="Nomor Telepon"
              />
            </div>

            <TextArea
              label="Alamat Perusahaan*"
              placeholder="Jl. Contoh No. Contoh"
              className="w-full"
              disabled
              value={customer?.alamat || "-"}
            />
          </div>
        </div>

        <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
          <div className="flex items-center gap-2">
            <InfoIcon className="text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">
              Identifikasi Faktur
            </h2>
          </div>

          <div className="-mx-6 border-t border-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mode === "view" && (
              <>
                <Controller
                  name="nomor_seri_faktur"
                  control={control}
                  render={({ field }) => (
                    <CInput
                      {...field}
                      label="Nomor Seri Faktur*"
                      type="text"
                      disabled={isViewMode}
                      error={!!errors.nomor_seri_faktur}
                      placeholder="000-00.00000000"
                    />
                  )}
                />
                <Controller
                  name="kode_objek"
                  control={control}
                  render={({ field }) => (
                    <CInput
                      {...field}
                      label="Kode Objek"
                      type="text"
                      disabled={isViewMode}
                      error={!!errors.kode_objek}
                      placeholder="Masukkan kode objek"
                    />
                  )}
                />
              </>
            )}

            <Controller
              name="masa_pajak"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CAutoComplete
                  label="Masa Pajak*"
                  options={MASA_PAJAK_OPTIONS}
                  value={value ? { value, label: `Masa ${value}` } : null}
                  onChange={(_, newValue) => onChange(newValue?.value ?? "")}
                  getOptionKey={(option) => option.value}
                  getOptionLabel={(option) => option.label}
                  placeholder="Pilih Masa Pajak"
                  error={!!errors.masa_pajak}
                  disabled={isViewMode}
                />
              )}
            />

            <Controller
              name="npwp"
              control={control}
              render={({ field }) => (
                <CInput
                  {...field}
                  label="NPWP*"
                  type="text"
                  placeholder="00.000.000.0-000.000"
                  error={!!errors.npwp}
                  disabled
                  value={field.value || ""}
                  inputProps={{ maxLength: 20 }}
                />
              )}
            />

            <Controller
              name="sub_total"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CInput
                  label="Sub Total*"
                  type="text"
                  icon="Rp"
                  value={formatCurrency(value)}
                  onChange={(e) => {
                    const raw = parseCurrency(e.target.value);
                    onChange(raw.toString());
                  }}
                  placeholder="0"
                  disabled
                  error={!!errors.sub_total}
                />
              )}
            />

            <Controller
              name="dpp_nilai_lain_fk"
              control={control}
              render={({ field: { value } }) => (
                <CInput
                  label="DPP Nilai Lain*"
                  type="text"
                  icon="Rp"
                  value={formatCurrency(value)}
                  placeholder="0"
                  disabled
                  error={!!errors.dpp_nilai_lain_fk}
                />
              )}
            />

            <Controller
              name="ppn_fk"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CInput
                  label="PPN (%)*"
                  type="text"
                  value={value ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9.]/g, "");
                    onChange(raw);
                    setValue("ppn_of", raw);
                  }}
                  placeholder="0"
                  icon="%"
                  disabled
                  error={!!errors.ppn_fk}
                />
              )}
            />

            <Controller
              name="jumlah_ppn_fk"
              control={control}
              render={({ field: { value } }) => (
                <CInput
                  label="Jumlah PPN*"
                  type="text"
                  icon="Rp"
                  value={
                    value
                      ? new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })
                          .format(Number(value))
                          .replace("Rp", "")
                          .trim()
                      : ""
                  }
                  placeholder="0"
                  disabled
                  error={!!errors.jumlah_ppn_fk}
                />
              )}
            />

            <Controller
              name="tahun"
              control={control}
              rules={{
                required: "Tahun wajib diisi",
                pattern: {
                  value: /^(19|20)\d{2}$/, // hanya tahun 1900–2099
                  message: "Masukkan tahun yang valid (contoh: 2025)",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <CInput
                  label="Tahun*"
                  type="text"
                  placeholder="Contoh: 2025"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={!!error}
                  helperText={error?.message}
                  disabled={isViewMode}
                />
              )}
            />
          </div>
        </div>

        {/* Section 3: Uraian Debit Note */}
        <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
          <div className="flex items-center gap-2">
            <InfoIcon className="text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">
              Informasi Uraian Debit Note
            </h2>
          </div>

          <div className="-mx-6 border-t border-gray-200" />
          <Controller
            name="ppn_of"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CInput
                label="PPN (%)*"
                type="text"
                value={value ?? ""}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^\d.]/g, "");
                  onChange(numericValue);
                }}
                disabled
                placeholder="11"
                className="w-1/2"
                icon="%"
                error={!!errors.ppn_of}
              />
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields?.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 p-4 border rounded-md"
              >
                <h3 className="font-semibold text-gray-700">
                  Periode {index + 1}
                </h3>

                <Controller
                  name={`uraian.${index}.id`}
                  control={control}
                  render={({ field }) => (
                    <CInput
                      {...field}
                      className="hidden"
                      placeholder="Nama Object"
                      disabled
                      value={
                        dataGoods?.data?.find((item) => item.id === field.value)
                          ?.name
                      }
                      error={!!errors.uraian?.[index]?.goods_id}
                    />
                  )}
                />

                {(dataDebitNoteById?.data?.berita_acara?.jenis_berita_acara ===
                  "fuel" &&
                  mode === "create") ||
                  ((mode === "view" || mode === "edit") &&
                    dataFakturById?.data?.berita_acara?.jenis_berita_acara ===
                      "fuel" && (
                      <div className="flex gap-2">
                        <Controller
                          name={`uraian.${index}.start_date`}
                          control={control}
                          render={({ field }) => (
                            <CInput
                              {...field}
                              label="Start Date*"
                              className="w-full"
                              type="date"
                              disabled
                              error={!!errors.uraian?.[index]?.start_date}
                              helperText={
                                errors.uraian?.[index]?.start_date?.message
                              }
                            />
                          )}
                        />

                        <Controller
                          name={`uraian.${index}.end_date`}
                          control={control}
                          render={({ field }) => (
                            <CInput
                              {...field}
                              label="End Date*"
                              className="w-full"
                              type="date"
                              disabled
                              error={!!errors.uraian?.[index]?.end_date}
                              helperText={
                                errors.uraian?.[index]?.end_date?.message
                              }
                            />
                          )}
                        />
                      </div>
                    ))}

                <Controller
                  name={`uraian.${index}.goods_id`}
                  control={control}
                  render={({ field }) => (
                    <CInput
                      {...field}
                      label="Nama Object*"
                      placeholder="Nama Object"
                      disabled
                      value={
                        dataGoods?.data?.find((item) => item.id === field.value)
                          ?.name
                      }
                      error={!!errors.uraian?.[index]?.goods_id}
                    />
                  )}
                />

                <Controller
                  name={`uraian.${index}.harga`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CInput
                      label="Harga Satuan*"
                      type="text"
                      icon="Rp"
                      value={formatCurrency(value)}
                      onChange={(e) => {
                        const raw = parseCurrency(e.target.value);
                        onChange(raw);
                      }}
                      placeholder="0"
                      disabled
                      error={!!errors.uraian?.[index]?.harga}
                    />
                  )}
                />

                <Controller
                  name={`uraian.${index}.satuan`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CAutoComplete
                      label="Satuan*"
                      options={dataSatuan?.data || []}
                      value={
                        dataSatuan?.data?.find((item) => item.name === value) ||
                        null
                      }
                      onChange={(_, newValue) =>
                        onChange(newValue ? newValue.name : "")
                      }
                      disabled
                      getOptionKey={(option) => option.name}
                      getOptionLabel={(option) => option.name}
                      placeholder="Pilih Satuan"
                      error={!!errors.uraian?.[index]?.satuan}
                    />
                  )}
                />

                <Controller
                  name={`uraian.${index}.quantity`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CInput
                      label="Jumlah Barang*"
                      type="text"
                      value={formatCurrency(value)}
                      onChange={(e) => {
                        const onlyNum = parseCurrency(e.target.value);
                        onChange(onlyNum);
                      }}
                      placeholder="0"
                      disabled
                      error={!!errors.uraian?.[index]?.quantity}
                    />
                  )}
                />

                <Controller
                  name={`uraian.${index}.total`}
                  control={control}
                  render={({ field: { value } }) => (
                    <CInput
                      label="Harga Total*"
                      type="text"
                      icon="Rp"
                      value={formatCurrency(value)}
                      disabled
                      error={!!errors.uraian?.[index]?.total}
                    />
                  )}
                />

                <Controller
                  name={`uraian.${index}.dpp_nilai_lain_of`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CInput
                      label="DPP Nilai Lain*"
                      type="text"
                      icon="Rp"
                      value={formatCurrency(value)}
                      onChange={(e) => {
                        const raw = parseCurrency(e.target.value);
                        onChange(raw);
                      }}
                      placeholder="0"
                      disabled
                      error={!!errors.uraian?.[index]?.dpp_nilai_lain_of}
                    />
                  )}
                />

                <Controller
                  name={`uraian.${index}.jumlah_ppn_of`}
                  control={control}
                  render={({ field: { value } }) => (
                    <CInput
                      label="Jumlah PPN*"
                      type="text"
                      icon="Rp"
                      value={formatCurrency(value)}
                      disabled
                      error={!!errors.uraian?.[index]?.jumlah_ppn_of}
                    />
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outlined"
            color="secondary"
            type="button"
            onClick={() => window.history.back()}
          >
            Kembali
          </Button>
          {!isViewMode && (
            <Button variant="contained" color="primary" type="submit">
              Simpan Faktur
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
