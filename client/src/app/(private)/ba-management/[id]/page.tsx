"use client";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { useMemo, useEffect } from "react";
import { Button, Alert } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import FeedIcon from "@mui/icons-material/Feed";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import useBeritaAcara from "../hooks";
import { CAutoComplete, CInput } from "@/components/atoms";
import useGlobal from "@/app/context/hooks";

export default function Page() {
  const {
    handleSubmit,
    onSubmit,
    onInvalid,
    control,
    errors,
    watch,
    setValue,
  } = useBeritaAcara();

  const {
    dataCustomer,
    dataTypeOfWork,
    dataUserProfile,
    dataDepartment,
    dataGoods,
    dataSatuan,
  } = useGlobal();

  const tipeTransaksi = watch("tipe_transaksi");
  const jenisBeritaAcara = watch("jenis_berita_acara");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "planAlokasiPeriode",
  });

  const watchedFields = useWatch({
    control,
    name: "planAlokasiPeriode",
  });

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseCurrency = (value: string) => {
    return Number(value?.replace(/\D/g, "") || 0);
  };

  const totalPlanLiter = useMemo(() => {
    if (!watchedFields) return 0;
    return watchedFields.reduce((sum: number, field: any) => {
      return sum + (Number(field?.plan_liter) || 0);
    }, 0);
  }, [watchedFields]);

  const totalActualLiter = useMemo(() => {
    if (!watchedFields) return 0;
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
    return watchedFields.reduce((sum: number, field: any) => {
      return sum + parseCurrency(field?.alokasi_backcharge || "0");
    }, 0);
  }, [watchedFields]);

  const isExceedingLimit = totalAlokasiBackcharge > totalKelebihan;
  const sisaAlokasi = totalKelebihan - totalAlokasiBackcharge;
  const hasKelebihan = totalKelebihan > 0;

  useEffect(() => {
    if (!watchedFields) return;

    watchedFields.forEach((field: any, index: number) => {
      const alokasiBackcharge = parseCurrency(field?.alokasi_backcharge || "0");
      const hargaPerLiter = parseCurrency(field?.harga_per_liter || "0");
      const nilaiBackcharge = alokasiBackcharge * hargaPerLiter;

      const currentNilai = parseCurrency(field?.nilai_backcharge || "0");
      if (currentNilai !== nilaiBackcharge) {
        setValue(
          `planAlokasiPeriode.${index}.nilai_backcharge`,
          formatCurrency(nilaiBackcharge.toString())
        );
      }
    });
  }, [watchedFields, setValue]);

  const handleAddPeriode = () => {
    append({
      planAlokasiPeriode: `Periode ${fields.length + 1}`,
      harga_per_liter: "0",
      plan_liter: "",
      actual_liter: "",
      alokasi_backcharge: "0",
      nilai_backcharge: "0",
    });
  };

  const handleRemovePeriode = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  useEffect(() => {
    if (!tipeTransaksi) {
      setValue("tipe_customer", "");
    }
    if (!jenisBeritaAcara) {
      setValue("type_of_work_id", "");
    }
  }, [tipeTransaksi, setValue, jenisBeritaAcara]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="flex flex-col gap-6"
    >
      {/* Identifikasi Berita Acara */}
      <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
        <div className="flex items-center gap-2">
          <InfoIcon className="text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900">
            Identifikasi Berita Acara
          </h2>
        </div>
        <div className="-mx-6 border-t border-gray-200" />
        <div className="w-full flex gap-6">
          <div className="w-full flex flex-col gap-2">
            <Controller
              name="tipe_transaksi"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CAutoComplete
                  label="Tipe Transaksi*"
                  options={[
                    { value: "trade", label: "Trade" },
                    { value: "nontrade", label: "Non Trade" },
                  ]}
                  className="w-full"
                  value={
                    [
                      { value: "trade", label: "Trade" },
                      { value: "nontrade", label: "Non Trade" },
                    ].find((option) => option.value === value) || null
                  }
                  onChange={(_, newValue) => onChange(newValue?.value || "")}
                  getOptionKey={(option) => option.value}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, val) =>
                    option.value === val?.value
                  }
                  placeholder="Pilih Tipe Transaksi*"
                  error={!!errors.tipe_transaksi}
                />
              )}
            />
            <Controller
              name="jenis_berita_acara"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CAutoComplete
                  label="Jenis Berita Acara*"
                  options={[
                    { value: "fuel", label: "Fuel" },
                    { value: "nonfuel", label: "Non Fuel" },
                  ]}
                  className="w-full"
                  value={
                    [
                      { value: "fuel", label: "Fuel" },
                      { value: "nonfuel", label: "Non Fuel" },
                    ].find((option) => option.value === value) || null
                  }
                  onChange={(_, newValue) => onChange(newValue?.value || "")}
                  getOptionKey={(option) => option.value}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, val) =>
                    option.value === val?.value
                  }
                  placeholder="Pilih Jenis Berita Acara"
                  error={!!errors.jenis_berita_acara}
                />
              )}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <CInput
              label="Nomor BA*"
              className="w-full"
              type="text"
              disabled
              value={"BA-001"}
            />
            <CInput
              label="Site*"
              className="w-full"
              type="text"
              disabled
              value={"SPRL"}
            />
          </div>
        </div>
      </div>

      {/* Informasi Berita Acara */}
      <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
        <div className="flex items-center gap-2">
          <FeedIcon className="text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900">
            Informasi Berita Acara
          </h2>
        </div>
        <div className="-mx-6 border-t border-gray-200" />
        <div className="flex gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <Controller
              name="customer_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CAutoComplete
                  label="Customer*"
                  options={dataCustomer?.data || []}
                  className="w-full"
                  value={
                    dataCustomer?.data?.find((item) => item.id === value) ||
                    null
                  }
                  onChange={(_, newValue) =>
                    onChange(newValue ? newValue.id : "")
                  }
                  getOptionKey={(option) => option.id}
                  getOptionLabel={(option) => option.name}
                  placeholder="Pilih Customer*"
                  error={!!errors.customer_id}
                />
              )}
            />
            <CInput
              label="Code Customer*"
              className="w-full"
              type="text"
              disabled
              value={
                dataCustomer?.data?.find(
                  (item) => item.id === watch("customer_id")
                )?.code || ""
              }
            />
            <Controller
              name="periode"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CInput
                  label="Periode*"
                  className="w-full"
                  error={!!errors.periode}
                  type="month"
                  value={
                    value ? `20${value.slice(2, 4)}-${value.slice(0, 2)}` : ""
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
            <Controller
              name="cut_off"
              control={control}
              render={({ field }) => (
                <CInput
                  {...field}
                  label="Cut Off*"
                  className="w-full"
                  type="date"
                  error={!!errors.cut_off}
                />
              )}
            />
            <Controller
              name="submitted_at"
              control={control}
              render={({ field }) => (
                <CInput
                  {...field}
                  label="Tanggal No BA Diminta*"
                  className="w-full"
                  type="date"
                  error={!!errors.submitted_at}
                  disabled
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Controller
              name="tipe_customer"
              control={control}
              render={({ field: { onChange, value } }) => {
                const isTrade = tipeTransaksi === "trade";
                const isDisabled = !tipeTransaksi || isTrade;
                const selectedValue = isTrade
                  ? { value: "customer", label: "Customer" }
                  : [
                      { value: "customer", label: "Customer" },
                      { value: "vendor", label: "Vendor" },
                    ].find((opt) => opt.value === value) || null;

                useEffect(() => {
                  if (isTrade) onChange("customer");
                }, [isTrade]);

                return (
                  <CAutoComplete
                    label="Tipe Customer*"
                    options={[
                      { value: "customer", label: "Customer" },
                      { value: "vendor", label: "Vendor" },
                    ]}
                    className="w-full"
                    value={selectedValue}
                    onChange={(_, newValue) =>
                      onChange(newValue ? newValue.value : "")
                    }
                    getOptionKey={(option) => option.value}
                    getOptionLabel={(option) => option.label}
                    placeholder="Pilih Tipe Customer*"
                    error={!!errors.tipe_customer}
                    disabled={isDisabled}
                  />
                );
              }}
            />
            <Controller
              name="type_of_work_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CAutoComplete
                  label="Jenis Pekerjaan*"
                  options={dataTypeOfWork?.data || []}
                  className="w-full"
                  value={
                    dataTypeOfWork?.data?.find((item) => item.id === value) ||
                    null
                  }
                  onChange={(_, newValue) =>
                    onChange(newValue ? newValue.id : "")
                  }
                  disabled={!jenisBeritaAcara}
                  getOptionKey={(option) => option.id}
                  getOptionLabel={(option) => option.name}
                  placeholder="Pilih Jenis Pekerjaan*"
                  error={!!errors.type_of_work_id}
                />
              )}
            />
            <Controller
              name="reguler"
              control={control}
              render={({ field: { onChange, value } }) => {
                const isTrade = tipeTransaksi === "trade";
                const isDisabled = !tipeTransaksi || isTrade;
                const options = [
                  { value: "reguler", label: "Reguler" },
                  { value: "nonreguler", label: "Non Reguler" },
                ];
                useEffect(() => {
                  if (isTrade) onChange("reguler");
                  else if (!tipeTransaksi) onChange("");
                }, [isTrade, tipeTransaksi]);
                const selectedValue =
                  options.find((opt) => opt.value === value) || null;
                return (
                  <CAutoComplete
                    label="Reguler*"
                    options={options}
                    className="w-full"
                    value={selectedValue}
                    onChange={(_, newValue) =>
                      onChange(newValue ? newValue.value : "")
                    }
                    disabled={isDisabled}
                    getOptionKey={(option) => option.value}
                    getOptionLabel={(option) => option.label}
                    placeholder="Pilih Reguler*"
                    error={!!errors.reguler}
                  />
                );
              }}
            />
            <Controller
              name="pic"
              control={control}
              render={({ field: { onChange, value } }) => {
                const departmentId = dataUserProfile?.data?.departmentId;
                const departmentName =
                  dataDepartment?.data?.find((dept) => dept.id === departmentId)
                    ?.name || "";

                useEffect(() => {
                  if (departmentId && value !== departmentId) {
                    onChange(departmentId);
                  }
                }, [departmentId, onChange, value]);

                return (
                  <CInput
                    label="PIC Dept*"
                    className="w-full"
                    type="text"
                    disabled
                    value={departmentName}
                  />
                );
              }}
            />
            {tipeTransaksi === "trade" && (
              <Controller
                name="nill_ditagihkan"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CAutoComplete
                    label="Nill/Ditagihkan*"
                    options={[
                      { label: "Nill", value: "nill" },
                      { label: "Ditagihkan", value: "ditagihkan" },
                    ]}
                    className="w-full"
                    value={
                      [
                        { label: "Nill", value: "nill" },
                        { label: "Ditagihkan", value: "ditagihkan" },
                      ].find((item) => item.value === value) || null
                    }
                    onChange={(_, newValue) =>
                      onChange(newValue ? newValue.value : "")
                    }
                    getOptionKey={(option) => option.value}
                    getOptionLabel={(option) => option.label}
                    placeholder="Pilih Nill/Ditagihkan*"
                    error={!!errors.nill_ditagihkan}
                  />
                )}
              />
            )}
          </div>
        </div>
      </div>

      {/* Informasi General - Non Trade Non Fuel */}
      {tipeTransaksi === "nontrade" && jenisBeritaAcara === "nonfuel" && (
        <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
          <div className="flex items-center gap-2">
            <ClearAllIcon className="text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">
              Informasi General
            </h2>
          </div>
          <div className="-mx-6 border-t border-gray-200" />
          <div className="flex gap-6 w-full">
            <div className="w-full flex flex-col gap-2">
              <Controller
                name="type_of_work_id"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CAutoComplete
                    label="Jenis Pekerjaan*"
                    options={dataTypeOfWork?.data || []}
                    className="w-full"
                    value={
                      dataTypeOfWork?.data?.find((item) => item.id === value) ||
                      null
                    }
                    onChange={(_, newValue) =>
                      onChange(newValue ? newValue.id : "")
                    }
                    disabled
                    getOptionKey={(option) => option.id}
                    getOptionLabel={(option) => option.name}
                    placeholder="Pilih Jenis Pekerjaan*"
                    error={!!errors.type_of_work_id}
                  />
                )}
              />
              <Controller
                name="goods_id"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CAutoComplete
                    label="Jenis Barang/Jasa*"
                    options={dataGoods?.data || []}
                    className="w-full"
                    value={
                      dataGoods?.data?.find((item) => item.id === value) || null
                    }
                    onChange={(_, newValue) =>
                      onChange(newValue ? newValue.id : "")
                    }
                    getOptionKey={(option) => option.id}
                    getOptionLabel={(option) => option.name}
                    placeholder="Pilih Jenis Pekerjaan*"
                    error={!!errors.goods_id}
                  />
                )}
              />
              <CInput
                label="Code Backcharge*"
                className="w-full"
                type="text"
                disabled
                value={
                  dataGoods?.data?.find((item) => item.id === watch("goods_id"))
                    ?.code || ""
                }
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Controller
                name="quantity"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <CInput
                    {...rest}
                    label="Quantity*"
                    className="w-full"
                    placeholder="Quantity"
                    type="text"
                    value={value}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                      onChange(onlyNumbers);
                    }}
                    error={!!errors.quantity}
                  />
                )}
              />
              <Controller
                name="satuan_id"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CAutoComplete
                    label="Satuan*"
                    options={dataSatuan?.data || []}
                    className="w-full"
                    value={
                      dataSatuan?.data?.find((item) => item.id === value) ||
                      null
                    }
                    onChange={(_, newValue) =>
                      onChange(newValue ? newValue.id : "")
                    }
                    getOptionKey={(option) => option.id}
                    getOptionLabel={(option) => option.name}
                    placeholder="Pilih Satuan*"
                    error={!!errors.satuan_id}
                  />
                )}
              />
              <Controller
                name="nill_ditagihkan"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CAutoComplete
                    label="Nill/Ditagihkan*"
                    options={[
                      { label: "Nill", value: "nill" },
                      { label: "Ditagihkan", value: "ditagihkan" },
                    ]}
                    className="w-full"
                    value={
                      [
                        { label: "Nill", value: "nill" },
                        { label: "Ditagihkan", value: "ditagihkan" },
                      ].find((item) => item.value === value) || null
                    }
                    onChange={(_, newValue) =>
                      onChange(newValue ? newValue.value : "")
                    }
                    getOptionKey={(option) => option.value}
                    getOptionLabel={(option) => option.label}
                    placeholder="Pilih Nill/Ditagihkan*"
                    error={!!errors.nill_ditagihkan}
                  />
                )}
              />
            </div>
          </div>
        </div>
      )}

      {/* Plan Kontrak & Alokasi Backcharge */}
      {jenisBeritaAcara === "fuel" && tipeTransaksi === "nontrade" && (
        <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
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
              onClick={handleAddPeriode}
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
                  onClick={() => handleRemovePeriode(index)}
                  type="button"
                  className="!absolute !top-0 !right-0 !z-10"
                >
                  Hapus
                </Button>
              )}

              <div className="w-full flex gap-6 pt-8">
                {/* Plan Kontrak */}
                <div className="w-full flex flex-col gap-2">
                  <h2 className="text-md font-bold text-gray-900">
                    Plan Kontrak
                  </h2>

                  <Controller
                    name={`planAlokasiPeriode.${index}.planAlokasiPeriode`}
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
                          !!errors.planAlokasiPeriode?.[index]
                            ?.planAlokasiPeriode
                        }
                      />
                    )}
                  />

                  <Controller
                    name={`planAlokasiPeriode.${index}.harga_per_liter`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CInput
                        label="Harga per Liter*"
                        className="w-full"
                        type="text"
                        icon="Rp"
                        value={value}
                        onChange={(e) => {
                          const formatted = formatCurrency(e.target.value);
                          onChange(formatted);
                        }}
                        placeholder="0"
                        error={
                          !!errors.planAlokasiPeriode?.[index]?.harga_per_liter
                        }
                      />
                    )}
                  />

                  <Controller
                    name={`planAlokasiPeriode.${index}.plan_liter`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CInput
                        label="Plan Liter*"
                        className="w-full"
                        type="text"
                        value={value}
                        icon="Ltr"
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          );
                          onChange(numericValue);
                        }}
                        placeholder="10"
                        error={!!errors.planAlokasiPeriode?.[index]?.plan_liter}
                      />
                    )}
                  />

                  <Controller
                    name={`planAlokasiPeriode.${index}.actual_liter`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CInput
                        label="Actual Liter*"
                        className="w-full"
                        type="text"
                        value={value}
                        icon="Ltr"
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          );
                          onChange(numericValue);
                        }}
                        placeholder="10"
                        error={
                          !!errors.planAlokasiPeriode?.[index]?.actual_liter
                        }
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
                    name={`planAlokasiPeriode.${index}.planAlokasiPeriode`}
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
                          !!errors.planAlokasiPeriode?.[index]
                            ?.planAlokasiPeriode
                        }
                      />
                    )}
                  />

                  <Controller
                    name={`planAlokasiPeriode.${index}.harga_per_liter`}
                    control={control}
                    render={({ field: { value } }) => (
                      <CInput
                        label="Harga per Liter*"
                        className="w-full"
                        type="text"
                        icon="Rp"
                        disabled
                        value={value}
                        placeholder="0"
                        error={
                          !!errors.planAlokasiPeriode?.[index]?.harga_per_liter
                        }
                      />
                    )}
                  />

                  <Controller
                    name={`planAlokasiPeriode.${index}.alokasi_backcharge`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CInput
                        label="Alokasi Backcharge*"
                        className="w-full"
                        type="text"
                        icon="Ltr"
                        value={value}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          );
                          const formatted = formatCurrency(numericValue);
                          onChange(formatted);
                        }}
                        placeholder="0"
                        disabled={!hasKelebihan}
                        error={
                          !!errors.planAlokasiPeriode?.[index]
                            ?.alokasi_backcharge
                        }
                      />
                    )}
                  />

                  <Controller
                    name={`planAlokasiPeriode.${index}.nilai_backcharge`}
                    control={control}
                    render={({ field: { value } }) => (
                      <CInput
                        label="Nilai Backcharge*"
                        className="w-full"
                        type="text"
                        icon="Rp"
                        value={value}
                        disabled
                        placeholder="0"
                        error={
                          !!errors.planAlokasiPeriode?.[index]?.nilai_backcharge
                        }
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
    </form>
  );
}
