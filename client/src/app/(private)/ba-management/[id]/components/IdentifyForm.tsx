import { Controller } from "react-hook-form";
import InfoIcon from "@mui/icons-material/Info";
import useBeritaAcara from "../../hooks";
import { CAutoComplete, CInput } from "@/components/atoms";

export default function IdentifyForm() {
  const { control, mode, errors, setValue, dataBeritaAcaraById } =
    useBeritaAcara();
  return (
    <>
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
                disabled={mode === "view" || mode === "edit"}
                onChange={(_, newValue) => {
                  const val = newValue?.value || "";
                  onChange(val);
                  setValue("tipe_customer", val === "trade" ? "customer" : "");
                  // setValue("reguler", val === "trade" ? "reguler" : "");
                }}
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
                disabled={mode === "view" || mode === "edit"}
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
            value={`${
              mode === "create"
                ? "x/xxxx/xx-xx/xx-x"
                : dataBeritaAcaraById?.data?.number
            }`}
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
    </>
  );
}
