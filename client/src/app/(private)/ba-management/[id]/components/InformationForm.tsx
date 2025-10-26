import { Controller } from "react-hook-form";
import useBeritaAcara from "../../hooks";
import FeedIcon from "@mui/icons-material/Feed";
import { CAutoComplete, CInput } from "@/components/atoms";
import useGlobal from "@/app/(private)/hooks";
import { useEffect } from "react";

export default function InformationForm() {
  const { control, mode, errors, setValue, watch } = useBeritaAcara();
  const { dataCustomer, dataTypeOfWork, dataUserProfile, dataDepartment } =
    useGlobal();
  const tipeTransaksi = watch("tipe_transaksi");
  const jenisBeritaAcara = watch("jenis_berita_acara");

  useEffect(() => {
    setValue("pic", dataUserProfile?.data?.department || "");
  }, [dataUserProfile, dataDepartment, setValue]);
  return (
    <>
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
            render={({ field: { onChange, value } }) => {
              const selectedCustomer =
                dataCustomer?.data?.find((item) => item.id === value) || null;
              return (
                <CAutoComplete
                  label="Customer*"
                  options={dataCustomer?.data || []}
                  className="w-full"
                  value={selectedCustomer}
                  onChange={(_, newValue) => {
                    onChange(newValue ? newValue.id : "");
                  }}
                  disabled={mode === "view"}
                  getOptionKey={(option) => option.id}
                  getOptionLabel={(option) => option.name}
                  placeholder="Pilih Customer*"
                  error={!!errors.customer_id}
                />
              );
            }}
          />

          <CInput
            label="Code Customer*"
            className="w-full"
            type="text"
            disabled
            placeholder="Code customer"
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
                disabled={mode === "view"}
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
                disabled={mode === "view"}
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
                  disabled={isDisabled || mode === "view"}
                />
              );
            }}
          />
          <Controller
            name="type_of_work_id"
            control={control}
            render={({ field: { onChange, value } }) => {
              const selectedTypeOfWork =
                dataTypeOfWork?.data?.find((item) => item.id === value) || null;
              return (
                <CAutoComplete
                  label="Jenis Pekerjaan*"
                  options={dataTypeOfWork?.data || []}
                  className="w-full"
                  value={selectedTypeOfWork}
                  onChange={(_, newValue) => {
                    onChange(newValue ? newValue.id : "");
                    if (!jenisBeritaAcara) setValue("type_of_work_id", "");
                  }}
                  disabled={!jenisBeritaAcara || mode === "view"}
                  getOptionKey={(option) => option.id}
                  getOptionLabel={(option) => option.name}
                  placeholder="Pilih Jenis Pekerjaan*"
                  error={!!errors.type_of_work_id}
                />
              );
            }}
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
                  disabled={isDisabled || mode === "view"}
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
            render={() => {
              return (
                <CInput
                  label="PIC Dept*"
                  className="w-full"
                  type="text"
                  disabled
                  value={watch("pic")}
                />
              );
            }}
          />
          {(tipeTransaksi === "trade" ||
            (tipeTransaksi === "nontrade" && jenisBeritaAcara === "fuel")) && (
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
                  disabled={mode === "view"}
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
    </>
  );
}
