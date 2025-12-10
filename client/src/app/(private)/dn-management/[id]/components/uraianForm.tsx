"use client";

import { useEffect, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { CInput, CAutoComplete } from "@/components/atoms";
import useDebitNote from "../../hooks";
import useGlobal from "@/app/(private)/hooks";
import { TextArea } from "@/components/atoms/Input-text-area";

export default function UraianSection() {
  const {
    control,
    setValue,
    errors,
    mode,
    fields,
    watch,
    dataBeritaAcaraById,
    dataDebitNoteById,
  } = useDebitNote();
  const { dataSatuan, dataGoods } = useGlobal();

  const uraian = useWatch({ control, name: "uraian" }) || [];
  const ppn = useWatch({ control, name: "ppn" }) || "0";

  useEffect(() => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    uraian.forEach((item: any, index: number) => {
      const volume = Number(item?.quantity || 0);
      const harga = Number(item?.harga || 0);
      const total = volume * harga;

      if (Number(item?.total) !== total) {
        setValue(`uraian.${index}.total`, total.toString(), {
          shouldValidate: false,
          shouldDirty: false,
        });
      }
    });
  }, [uraian, setValue]);

  // Hitung subtotal & total keseluruhan
  const subTotal = useMemo(() => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return uraian.reduce((sum: number, item: any) => {
      return sum + Number(item?.total || 0);
    }, 0);
  }, [uraian]);

  const ppnPersen = Number(ppn) || 0;
  const dppNilaiLain = Math.round((11 / 12) * subTotal);
  const nilaiPpn = Math.round(dppNilaiLain * (ppnPersen / 100));
  const total = subTotal + nilaiPpn;

  useEffect(() => {
    setValue("sub_total", subTotal.toString());
    setValue("total", total.toString());
    setValue("dpp_nilai_lain_fk", dppNilaiLain.toString());
  }, [subTotal, total, setValue]);

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ReceiptIcon className="text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900">
            Uraian & Perhitungan
          </h2>
        </div>
      </div>

      <div className="-mx-6 border-t border-gray-200" />

      {/* Daftar Uraian */}
      {fields.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Belum ada uraian. Klik Tambah Uraian.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => {
            const goodsId = watch(`uraian.${index}.goods_id`);
            const satuanName = watch(`uraian.${index}.satuan`);
            const quantity = watch(`uraian.${index}.quantity`);
            const total = watch(`uraian.${index}.total`);

            return (
              <div
                key={field.id}
                className="relative border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Uraian */}
                  <Controller
                    name={`uraian.${index}.periode`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CInput
                        label="Periode*"
                        className="w-full"
                        error={!!errors.uraian?.[index]?.periode}
                        type="month"
                        disabled={mode === "view"}
                        value={
                          value
                            ? `20${value.slice(2, 4)}-${value.slice(0, 2)}`
                            : ""
                        }
                        onChange={(e) => {
                          const [year, month] = e.target.value.split("-");
                          onChange(`${month}${year.slice(2)}`);
                        }}
                        onFocus={(e) => {
                          const input = e.target as HTMLInputElement;
                          if (input.showPicker) input.showPicker();
                        }}
                      />
                    )}
                  />
                  {((dataBeritaAcaraById?.data?.jenis_berita_acara === "fuel" &&
                    mode === "create") ||
                    ((mode === "edit" || mode === "view") &&
                      dataDebitNoteById?.data?.berita_acara
                        ?.jenis_berita_acara === "fuel")) && (
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
                  )}

                  <CInput
                    label="Uraian*"
                    placeholder="Deskripsi uraian"
                    disabled
                    value={
                      dataGoods?.data?.find((g) => g.id === goodsId)?.name || ""
                    }
                    error={!!errors.uraian?.[index]?.goods_id}
                  />

                  {/* Satuan */}
                  <CAutoComplete
                    label="Satuan*"
                    options={dataSatuan?.data || []}
                    value={
                      dataSatuan?.data?.find((s) => s.name === satuanName) ||
                      null
                    }
                    disabled
                    getOptionKey={(option) => option.name}
                    getOptionLabel={(option) => option.name}
                    placeholder="Pilih Satuan*"
                    error={!!errors.uraian?.[index]?.satuan}
                  />

                  {/* Volume */}
                  <CInput
                    label="Volume*"
                    type="text"
                    value={quantity}
                    placeholder="0"
                    disabled
                    error={!!errors.uraian?.[index]?.quantity}
                  />

                  {/* Harga */}
                  <Controller
                    name={`uraian.${index}.harga`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CInput
                        label="Harga Satuan*"
                        type="text"
                        icon="Rp"
                        disabled={
                          dataBeritaAcaraById?.data?.jenis_berita_acara ===
                            "fuel" || mode === "view"
                        }
                        value={
                          value
                            ? new Intl.NumberFormat("id-ID", {
                                minimumFractionDigits: 0,
                              }).format(Number(value.replace(/[^\d]/g, "")))
                            : ""
                        }
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^\d]/g, ""); // hanya angka
                          onChange(raw); // tetap string misal "1000000"
                        }}
                        placeholder="0"
                        error={!!errors.uraian?.[index]?.harga}
                      />
                    )}
                  />

                  <CInput
                    label="Jumlah (Auto)"
                    type="text"
                    icon="Rp"
                    value={
                      total
                        ? new Intl.NumberFormat("id-ID", {
                            minimumFractionDigits: 0,
                          }).format(Number(total.replace(/[^\d]/g, "")))
                        : ""
                    }
                    placeholder="Rp x.xxx.xxx"
                    disabled
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ringkasan */}
      <div className="mt-6 bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Ringkasan Biaya
        </h3>

        <div className="space-y-3 mb-10">
          <div className="flex justify-between items-center pb-3 border-b border-blue-200">
            <span className="text-gray-700 font-medium">Sub Total:</span>
            <span className="text-xl font-bold text-gray-900">
              Rp {subTotal.toLocaleString("id-ID")}
            </span>
          </div>

          {/* Input PPN Persen */}

          <div className="flex justify-between items-center pb-3 border-b border-blue-200">
            <span className="text-gray-700 font-medium">DPP Nilai Lain:</span>
            <span className="text-lg font-semibold text-blue-600">
              Rp {dppNilaiLain.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-blue-200">
            <span className="text-gray-700 font-medium">PPN (%):</span>
            <div className="w-32">
              <Controller
                name="ppn"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CInput
                    type="text"
                    value={value}
                    onChange={(e) =>
                      onChange(e.target.value.replace(/[^\d.]/g, ""))
                    }
                    disabled={mode === "view"}
                    placeholder="11"
                    error={!!errors.ppn}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-blue-200">
            <span className="text-gray-700 font-medium">Nilai PPN:</span>
            <span className="text-lg font-semibold text-blue-600">
              Rp {nilaiPpn.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-900 font-bold text-lg">
              Total (Sub Total + Nilai PPN):
            </span>
            <span className="text-2xl font-bold text-green-600">
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <Controller
          name="harga_terbilang"
          control={control}
          render={({ field }) => (
            <TextArea
              label="Harga Terbilang*"
              placeholder="Dua Puluh Juta Delapan Ratus Lima Puluh Ribu Rupiah"
              className="w-full"
              {...field}
              disabled={mode === "view"}
            />
          )}
        />
      </div>
    </div>
  );
}
