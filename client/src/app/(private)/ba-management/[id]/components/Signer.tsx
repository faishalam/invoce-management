import { CAutoComplete, CInput } from "@/components/atoms";
import GroupIcon from "@mui/icons-material/Group";
import { Controller } from "react-hook-form";
import useBeritaAcara from "../../hooks";
import useGlobal from "@/app/(private)/hooks";
import { useEffect } from "react";

export default function Signer() {
  const { control, errors, mode, setValue } = useBeritaAcara();
  const { dataDepartment } = useGlobal();

  useEffect(() => {
    setValue("signers.0.dept", "vendor");
  }, []);
  return (
    <>
      <div className="flex items-center gap-2">
        <GroupIcon className="text-blue-500" />
        <h2 className="text-xl font-bold text-gray-900">Signers</h2>
      </div>
      <div className="-mx-6 border-t border-gray-200" />
      <div className="flex gap-6">
        <div className="w-full ">
          <Controller
            name="signers.0.name"
            control={control}
            render={({ field }) => (
              <CInput
                {...field}
                label="Nama Signer Vendor*"
                className="w-full"
                type="text"
                placeholder="Masukkan nama"
                error={!!errors?.signers?.[0]?.name}
                disabled={mode === "view"}
              />
            )}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Controller
            name="signers.1.name"
            control={control}
            render={({ field }) => (
              <CInput
                {...field}
                label="Nama Signer 1*"
                className="w-full"
                type="text"
                placeholder="Masukkan nama"
                error={!!errors?.signers?.[1]?.name}
                disabled={mode === "view"}
              />
            )}
          />
          <Controller
            name="signers.1.dept"
            control={control}
            render={({ field: { onChange, value } }) => {
              const options = dataDepartment?.data ?? [];
              return (
                <CAutoComplete
                  error={!!errors.signers?.[1]?.dept}
                  label="Department Signer 1"
                  options={options}
                  className="w-full"
                  disabled={mode === "view"}
                  placeholder="Masukkan Dept Signer"
                  value={options.find((opt) => opt.name === value) ?? null}
                  onChange={(_, newValue) => onChange(newValue?.name ?? "")}
                  getOptionLabel={(option) => option?.name ?? ""}
                  isOptionEqualToValue={(option, val) =>
                    option.name === val?.name
                  }
                />
              );
            }}
          />
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-full flex flex-col gap-2">
          <Controller
            name="signers.2.name"
            control={control}
            render={({ field }) => (
              <CInput
                {...field}
                label="Nama Signer 2*"
                className="w-full"
                type="text"
                disabled={mode === "view"}
                placeholder="Masukkan nama"
                error={!!errors?.signers?.[2]?.name}
              />
            )}
          />
          <Controller
            name="signers.2.dept"
            control={control}
            render={({ field: { onChange, value } }) => {
              const options = dataDepartment?.data ?? [];
              return (
                <CAutoComplete
                  error={!!errors.signers?.[2]?.dept}
                  label="Department Signer 2*"
                  options={options}
                  className="w-full"
                  disabled={mode === "view"}
                  placeholder="Masukkan Dept Signer"
                  value={options.find((opt) => opt.name === value) ?? null}
                  onChange={(_, newValue) => onChange(newValue?.name ?? "")}
                  getOptionLabel={(option) => option?.name ?? ""}
                  isOptionEqualToValue={(option, val) =>
                    option.name === val?.name
                  }
                />
              );
            }}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Controller
            name="signers.3.name"
            control={control}
            render={({ field }) => (
              <CInput
                {...field}
                label="Nama Signer 3*"
                className="w-full"
                disabled={mode === "view"}
                type="text"
                placeholder="Masukkan nama"
                error={!!errors?.signers?.[2]?.name}
              />
            )}
          />
          <Controller
            name="signers.3.dept"
            control={control}
            render={({ field: { onChange, value } }) => {
              const options = dataDepartment?.data ?? [];
              return (
                <CAutoComplete
                  error={!!errors.signers?.[3]?.dept}
                  label="Department Signer 3*"
                  options={options}
                  className="w-full"
                  disabled={mode === "view"}
                  placeholder="Masukkan Dept Signer"
                  value={options.find((opt) => opt.name === value) ?? null}
                  onChange={(_, newValue) => onChange(newValue?.name ?? "")}
                  getOptionLabel={(option) => option?.name ?? ""}
                  isOptionEqualToValue={(option, val) =>
                    option.name === val?.name
                  }
                />
              );
            }}
          />
        </div>
      </div>
    </>
  );
}
