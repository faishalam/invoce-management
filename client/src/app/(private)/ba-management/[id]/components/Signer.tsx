import { CInput } from "@/components/atoms";
import GroupIcon from "@mui/icons-material/Group";
import { Controller } from "react-hook-form";
import useBeritaAcara from "../../hooks";
import { useEffect } from "react";

export default function Signer() {
  const { control, errors, mode, setValue } = useBeritaAcara();

  useEffect(() => {
    setValue("signers.0.position", "vendor");
  }, []);
  return (
    <>
      <div className="flex items-center gap-2">
        <GroupIcon className="text-blue-500" />
        <h2 className="text-xl font-bold text-gray-900">Signers</h2>
      </div>
      <div className="-mx-6 border-t border-gray-200" />
      <div className="flex gap-6">
        <div className="w-full flex flex-col gap-2">
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
          <Controller
            name="signers.0.position"
            control={control}
            render={({ field }) => (
              <CInput
                {...field}
                label="Jabatan Signer Vendor*"
                className="w-full"
                type="text"
                placeholder="Masukkan jabatan"
                error={!!errors?.signers?.[0]?.position}
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
            name="signers.1.position"
            control={control}
            render={({ field }) => (
              <CInput
                {...field}
                label="Jabatan Signer 1*"
                className="w-full"
                type="text"
                placeholder="Masukkan jabatan"
                error={!!errors?.signers?.[1]?.position}
                disabled={mode === "view"}
              />
            )}
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
            name="signers.2.position"
            control={control}
            render={({ field }) => (
              <CInput
                {...field}
                label="Jabatan Signer 2*"
                className="w-full"
                type="text"
                placeholder="Masukkan jabatan"
                error={!!errors?.signers?.[2]?.position}
                disabled={mode === "view"}
              />
            )}
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
            name="signers.3.position"
            control={control}
            render={({ field }) => (
              <CInput
                {...field}
                label="Jabatan Signer 3*"
                className="w-full"
                type="text"
                placeholder="Masukkan jabatan"
                error={!!errors?.signers?.[3]?.position}
                disabled={mode === "view"}
              />
            )}
          />
        </div>
      </div>
    </>
  );
}
