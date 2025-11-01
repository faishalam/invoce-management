import TimelineIcon from "@mui/icons-material/Timeline";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Alert, Button } from "@mui/material";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import useBeritaAcara from "../../hooks";
import { useEffect, useMemo } from "react";
import { CInput } from "@/components/atoms";

export default function BackchargeForm() {
  const { control, mode, errors, setValue, getValues } = useBeritaAcara();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "plan_alokasi_periode",
  });

  const watchedFields = useWatch({
    control,
    name: "plan_alokasi_periode",
  });

  const parseCurrency = (value: string) => {
    return Number(value?.replace(/\D/g, "") || 0);
  };

  const totalPlanLiter = useMemo(() => {
    if (!watchedFields) return 0;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return watchedFields.reduce((sum: number, field: any) => {
      return sum + (Number(field?.plan_liter) || 0);
    }, 0);
  }, [watchedFields]);

  const totalActualLiter = useMemo(() => {
    if (!watchedFields) return 0;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return watchedFields.reduce((sum: number, field: any) => {
      return sum + (Number(field?.actual_liter) || 0);
    }, 0);
  }, [watchedFields]);

  const totalKelebihan = useMemo(() => {
    const kelebihan = totalActualLiter - totalPlanLiter;
    return kelebihan > 0 ? kelebihan : 0;
  }, [totalActualLiter, totalPlanLiter]);

  const totalAlokasiBackcharge = useMemo(() => {
    if (!watchedFields) return 0;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return watchedFields.reduce((sum: number, field: any) => {
      return sum + parseCurrency(field?.alokasi_backcharge || "0");
    }, 0);
  }, [watchedFields]);

  const isExceedingLimit = totalAlokasiBackcharge > totalKelebihan;
  const sisaAlokasi = totalKelebihan - totalAlokasiBackcharge;
  const hasKelebihan = totalKelebihan > 0;

  useEffect(() => {
    if (!watchedFields) return;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    watchedFields.forEach((field: any, index: number) => {
      const alokasiBackcharge = parseCurrency(field?.alokasi_backcharge || "0");
      const hargaPerLiter = parseCurrency(field?.harga_per_liter || "0");
      const nilaiBackcharge = alokasiBackcharge * hargaPerLiter;

      const currentNilai = parseCurrency(field?.nilai_backcharge || "0");
      if (currentNilai !== nilaiBackcharge) {
        setValue(
          `plan_alokasi_periode.${index}.nilai_backcharge`,
          nilaiBackcharge.toString()
        );
      }
    });
  }, [watchedFields, setValue]);

  useEffect(() => {
    if (!watchedFields || watchedFields.length === 0) return;

    watchedFields.forEach((_, index: number) => {
      const value =
        Number(totalKelebihan) > 0
          ? totalKelebihan.toString()
          : "Tidak ada kelebihan";

      const current = getValues(
        `plan_alokasi_periode.${index}.total_kelebihan`
      );
      if (current !== value) {
        setValue(`plan_alokasi_periode.${index}.total_kelebihan`, value);
      }
    });
  }, [watchedFields, totalKelebihan, setValue]);

  useEffect(() => {
    if (!watchedFields) return;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    watchedFields.forEach((_: any, index: number) => {
      const current = getValues(
        `plan_alokasi_periode.${index}.plan_alokasi_periode`
      );
      const expected = `Periode ${index + 1}`;
      if (current !== expected) {
        setValue(
          `plan_alokasi_periode.${index}.plan_alokasi_periode`,
          expected
        );
      }
    });
  }, [watchedFields, setValue, getValues]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TimelineIcon className="text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900">
            Plan Kontrak & Alokasi Backcharge
          </h2>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            append({
              plan_alokasi_periode: ``,
              harga_per_liter: "0",
              plan_liter: "",
              actual_liter: "",
              alokasi_backcharge: "0",
              nilai_backcharge: "0",
              total_kelebihan: "0",
            });
          }}
          type="button"
          className="!bg-blue-500"
        >
          Tambah Periode
        </Button>
      </div>

      <div className="-mx-6 border-t border-gray-200" />

      {/* Summary Card */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Plan Liter</p>
            <p className="text-lg font-bold text-gray-900">
              {totalPlanLiter.toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Actual Liter</p>
            <p className="text-lg font-bold text-gray-900">
              {totalActualLiter.toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Kelebihan</p>
            <p
              className={`text-lg font-bold ${
                hasKelebihan ? "text-green-600" : "text-gray-900"
              }`}
            >
              {totalKelebihan.toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sisa Alokasi</p>
            <p
              className={`text-lg font-bold ${
                isExceedingLimit ? "text-red-600" : "text-blue-600"
              }`}
            >
              {sisaAlokasi.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {!hasKelebihan && (
        <Alert severity="info">
          Tidak ada kelebihan liter. Alokasi backcharge tidak dapat diisi.
        </Alert>
      )}

      {isExceedingLimit && (
        <Alert severity="error">
          Total alokasi backcharge (
          {totalAlokasiBackcharge.toLocaleString("id-ID")}) melebihi total
          kelebihan ({totalKelebihan.toLocaleString("id-ID")})!
        </Alert>
      )}

      {/* Fields */}
      {fields.map((field, index) => (
        <div key={field.id} className="relative">
          {fields.length > 1 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => remove(index)}
              type="button"
              className="!absolute !top-0 !right-0 !z-10"
            >
              Hapus
            </Button>
          )}

          <div className="w-full flex gap-6 pt-8">
            {/* Plan Kontrak */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-md font-bold text-gray-900">Plan Kontrak</h2>

              <Controller
                name={`plan_alokasi_periode.${index}.plan_alokasi_periode`}
                control={control}
                render={({ field }) => (
                  <CInput
                    {...field}
                    disabled
                    label="Periode*"
                    className="w-full"
                    type="text"
                    value={`Periode ${index + 1}`}
                    error={
                      !!errors.plan_alokasi_periode?.[index]
                        ?.plan_alokasi_periode
                    }
                  />
                )}
              />

              <Controller
                name={`plan_alokasi_periode.${index}.harga_per_liter`}
                control={control}
                render={({ field: { value, onChange } }) => {
                  const displayValue =
                    value && !isNaN(Number(value))
                      ? new Intl.NumberFormat("id-ID").format(Number(value))
                      : "";
                  return (
                    <CInput
                      label="Harga per Liter*"
                      className="w-full"
                      type="text"
                      icon="Rp"
                      value={displayValue}
                      disabled={mode === "view"}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d]/g, "");
                        onChange(raw);
                      }}
                      placeholder="0"
                      error={
                        !!errors.plan_alokasi_periode?.[index]?.harga_per_liter
                      }
                    />
                  );
                }}
              />

              <Controller
                name={`plan_alokasi_periode.${index}.plan_liter`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CInput
                    label="Plan Liter*"
                    className="w-full"
                    type="text"
                    disabled={mode === "view"}
                    value={value}
                    icon="Ltr"
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      onChange(numericValue);
                    }}
                    placeholder="10"
                    error={!!errors.plan_alokasi_periode?.[index]?.plan_liter}
                  />
                )}
              />

              <Controller
                name={`plan_alokasi_periode.${index}.actual_liter`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CInput
                    label="Actual Liter*"
                    className="w-full"
                    type="text"
                    disabled={mode === "view"}
                    value={value}
                    icon="Ltr"
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      onChange(numericValue);
                    }}
                    placeholder="10"
                    error={!!errors.plan_alokasi_periode?.[index]?.actual_liter}
                  />
                )}
              />
            </div>

            {/* Alokasi Backcharge */}
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-md font-bold text-gray-900">
                Alokasi Backcharge
              </h2>

              <Controller
                name={`plan_alokasi_periode.${index}.plan_alokasi_periode`}
                control={control}
                render={({ field }) => (
                  <CInput
                    {...field}
                    label="Periode*"
                    className="w-full"
                    type="text"
                    disabled
                    value={`Periode ${index + 1}`}
                    error={
                      !!errors.plan_alokasi_periode?.[index]
                        ?.plan_alokasi_periode
                    }
                  />
                )}
              />

              <Controller
                name={`plan_alokasi_periode.${index}.harga_per_liter`}
                control={control}
                render={({ field: { value, onChange } }) => {
                  const displayValue =
                    value && !isNaN(Number(value))
                      ? new Intl.NumberFormat("id-ID").format(Number(value))
                      : "";
                  return (
                    <CInput
                      label="Harga per Liter*"
                      className="w-full"
                      type="text"
                      icon="Rp"
                      value={displayValue}
                      disabled
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d]/g, "");
                        onChange(raw);
                      }}
                      placeholder="0"
                      error={
                        !!errors.plan_alokasi_periode?.[index]?.harga_per_liter
                      }
                    />
                  );
                }}
              />
              <Controller
                name={`plan_alokasi_periode.${index}.alokasi_backcharge`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CInput
                    label="Alokasi Backcharge*"
                    className="w-full"
                    type="text"
                    icon="Ltr"
                    value={value}
                    disabled={mode === "view"}
                    onChange={(e) => {
                      const numeric = e.target.value.replace(/[^\d]/g, ""); // hanya angka
                      onChange(numeric); // simpan sebagai string angka murni
                    }}
                    placeholder="0"
                    error={
                      !!errors.plan_alokasi_periode?.[index]?.alokasi_backcharge
                    }
                  />
                )}
              />

              <Controller
                name={`plan_alokasi_periode.${index}.nilai_backcharge`}
                control={control}
                render={({ field: { value, onChange } }) => {
                  const displayValue =
                    value && !isNaN(Number(value))
                      ? new Intl.NumberFormat("id-ID").format(Number(value))
                      : "";

                  return (
                    <CInput
                      label="Nilai Backcharge*"
                      className="w-full"
                      type="text"
                      icon="Rp"
                      value={displayValue}
                      disabled
                      placeholder="0"
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        onChange(rawValue);
                      }}
                      error={
                        !!errors.plan_alokasi_periode?.[index]?.nilai_backcharge
                      }
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
