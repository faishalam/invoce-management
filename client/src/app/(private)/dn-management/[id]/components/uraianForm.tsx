import { useEffect, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Button, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { CInput, CAutoComplete } from "@/components/atoms";
import useDebitNote from "../../hooks";
import useGlobal from "@/app/(private)/hooks";

export default function UraianSection() {
  const { control, setValue, errors, mode, append, remove, fields } =
    useDebitNote();
  const { dataSatuan } = useGlobal();

  const watchedUraian = useWatch({ control, name: "uraian" });
  const watchedPpn = useWatch({ control, name: "ppn" });

  const formatCurrency = (value: string | number) => {
    const num = value?.toString().replace(/[^\d]/g, "") || "0";
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseCurrency = (value: string) => value?.replace(/[^\d]/g, "") || "0";

  const subTotal = useMemo(() => {
    if (!watchedUraian) return 0;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return watchedUraian.reduce((sum: number, item: any) => {
      return sum + Number(item?.jumlah || 0);
    }, 0);
  }, [watchedUraian]);

  const ppnPersen = parseFloat(watchedPpn || "0") || 0;
  const nilaiPpn = Math.round(subTotal * (ppnPersen / 100));
  const total = subTotal + nilaiPpn;

  useEffect(() => {
    if (!watchedUraian) return;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    watchedUraian.forEach((item: any, index: number) => {
      const volume = Number(item?.volume || 0);
      const harga = Number(item?.harga || 0);
      const jumlah = volume * harga;
      if (Number(item?.jumlah) !== jumlah) {
        setValue(`uraian.${index}.jumlah`, jumlah.toString());
      }
    });
  }, [watchedUraian, setValue]);

  // Set subtotal, total
  useEffect(() => {
    setValue("sub_total", subTotal.toString());
    setValue("total", total.toString());
  }, [subTotal, total, setValue]);

  const handleAddUraian = () => {
    append({
      uraian: "",
      satuan: "",
      volume: "",
      harga: "",
      jumlah: "0",
    });
  };

  const handleRemoveUraian = (index: number) => {
    remove(index);
  };

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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUraian}
          type="button"
          className="!bg-blue-500"
          disabled={mode === "view"}
        >
          Tambah Uraian
        </Button>
      </div>

      <div className="-mx-6 border-t border-gray-200" />

      {/* Daftar Uraian */}
      {fields.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Belum ada uraian. Klik Tambah Uraian.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-700">
                  Item #{index + 1}
                </div>
                {fields.length > 1 && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleRemoveUraian(index)}
                    type="button"
                    disabled={mode === "view"}
                  >
                    Hapus
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Uraian */}
                <Controller
                  name={`uraian.${index}.uraian`}
                  control={control}
                  render={({ field }) => (
                    <CInput
                      {...field}
                      label="Uraian*"
                      placeholder="Deskripsi uraian"
                      disabled={mode === "view"}
                      error={!!errors.uraian?.[index]?.uraian}
                    />
                  )}
                />

                {/* Satuan */}
                <Controller
                  name={`uraian.${index}.satuan`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CAutoComplete
                      label="Satuan*"
                      options={dataSatuan?.data || []}
                      className="w-full"
                      value={
                        dataSatuan?.data?.find((item) => item.name === value) ||
                        null
                      }
                      onChange={(_, newValue) =>
                        onChange(newValue ? newValue.name : "")
                      }
                      disabled={mode === "view"}
                      getOptionKey={(option) => option.name}
                      getOptionLabel={(option) => option.name}
                      placeholder="Pilih Satuan*"
                      error={!!errors.uraian?.[index]?.satuan}
                    />
                  )}
                />
                {/* Volume */}
                <Controller
                  name={`uraian.${index}.volume`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CInput
                      label="Volume*"
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const onlyNum = parseCurrency(e.target.value);
                        onChange(onlyNum);
                      }}
                      placeholder="0"
                      disabled={mode === "view"}
                      error={!!errors.uraian?.[index]?.volume}
                    />
                  )}
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
                      value={formatCurrency(value)}
                      onChange={(e) => {
                        const raw = parseCurrency(e.target.value);
                        onChange(raw);
                      }}
                      placeholder="0"
                      disabled={mode === "view"}
                      error={!!errors.uraian?.[index]?.harga}
                    />
                  )}
                />

                {/* Jumlah (otomatis) */}
                <Controller
                  name={`uraian.${index}.jumlah`}
                  control={control}
                  render={({ field: { value } }) => (
                    <CInput
                      label="Jumlah (Auto)"
                      type="text"
                      icon="Rp"
                      value={formatCurrency(value)}
                      disabled
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ringkasan */}
      <div className="mt-6 bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Ringkasan Biaya
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-blue-200">
            <span className="text-gray-700 font-medium">Sub Total:</span>
            <span className="text-xl font-bold text-gray-900">
              Rp {formatCurrency(subTotal)}
            </span>
          </div>

          {/* Input PPN Persen */}
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
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(
                        /[^\d.]/g,
                        ""
                      );
                      onChange(numericValue);
                    }}
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
              Rp {formatCurrency(nilaiPpn)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-900 font-bold text-lg">Total:</span>
            <span className="text-2xl font-bold text-green-600">
              Rp {formatCurrency(total)}
            </span>
          </div>
        </div>

        <Alert severity="info" className="mt-4">
          Nilai dikirim ke backend tanpa titik. Contoh: Rp 1.000.000 → 1000000
        </Alert>
      </div>
    </div>
  );
}
