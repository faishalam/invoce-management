import { Box, Button, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useUserManagement from "../hooks";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Controller } from "react-hook-form";
import CInput from "@/components/atoms/input";
import { useMemo, useState } from "react";
import CIconButton from "@/components/atoms/icon-button";
import CAutoComplete from "@/components/atoms/auto-complete";
import UserFormSkeleton from "./LoadingSkeleton";
import useGlobal from "@/app/(private)/hooks";

export default function UserModal() {
  const {
    openModalUser,
    setOpenModalUser,
    setSelectedUserId,
    control,
    handleSubmit,
    onSubmit,
    onInvalid,
    mode,
    errors,
    isLoadingCreateUser,
    isLoadingUpdateUser,
    isLoadingDataUserById,
  } = useUserManagement();
  const handleClose = () => {
    setOpenModalUser(false);
    setSelectedUserId("");
  };
  const { dataDepartment } = useGlobal();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const title = useMemo(() => {
    if (mode === "create") return "Create New User";
    if (mode === "edit") return "Edit Profile User";
    if (mode === "view") return "View Profile User";
  }, [mode]);

  return (
    <>
      <Modal
        open={openModalUser}
        onClose={handleClose}
        aria-labelledby="modal-user-profile"
        className="flex justify-center items-center px-4 md:px-40"
      >
        <Box className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </div>

          <div className="overflow-y-auto max-h-[80vh] p-6">
            {isLoadingDataUserById && mode !== "create" ? (
              <UserFormSkeleton />
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4">
                    <AccountCircleOutlinedIcon
                      sx={{ fontSize: 100, color: "#6B7280" }}
                    />
                  </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
                  <div className="space-y-2 mb-12 text-black">
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <CInput
                          {...field}
                          label="Nama*"
                          className="w-full"
                          type="text"
                          placeholder="Masukkan nama pengguna"
                          disabled={mode === "view"}
                          error={!!errors.name}
                        />
                      )}
                    />
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <CInput
                          {...field}
                          label="Email*"
                          className="w-full"
                          type="email"
                          placeholder="Masukkan email pengguna"
                          disabled={mode === "view"}
                          error={!!errors.email}
                        />
                      )}
                    />

                    {mode === "create" && (
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <CInput
                            label="Password*"
                            placeholder="Enter password"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            required
                            error={!!errors.password}
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <CIconButton
                                    size="small"
                                    edge="end"
                                    onClick={toggleShowPassword}
                                  >
                                    {showPassword ? (
                                      <VisibilityOff className="text-gray-400" />
                                    ) : (
                                      <Visibility className="text-gray-400" />
                                    )}
                                  </CIconButton>
                                ),
                              },
                            }}
                          />
                        )}
                      />
                    )}
                    {mode !== "edit" && (
                      <Controller
                        name="department_id"
                        control={control}
                        render={({ field: { onChange, value } }) => {
                          const options = dataDepartment?.data ?? [];
                          return (
                            <CAutoComplete
                              error={!!errors.department_id}
                              label="Department*"
                              options={options}
                              className="w-full"
                              disabled={mode === "view"}
                              placeholder="Masukkan department pengguna"
                              value={
                                options.find((opt) => opt.id === value) ?? null
                              }
                              onChange={(_, newValue) =>
                                onChange(newValue?.id ?? "")
                              }
                              getOptionLabel={(option) => option?.name ?? ""}
                              isOptionEqualToValue={(option, val) =>
                                option.id === val?.id
                              }
                            />
                          );
                        }}
                      />
                    )}
                    {mode !== "edit" && (
                      <Controller
                        name="role"
                        control={control}
                        render={({ field: { onChange, value } }) => {
                          const options = [
                            { label: "Admin", value: "admin" },
                            { label: "User", value: "user" },
                          ];
                          return (
                            <CAutoComplete
                              error={!!errors.role}
                              label="Role*"
                              options={options}
                              disabled={mode === "view"}
                              className="w-full"
                              placeholder="Masukkan role pengguna"
                              value={
                                options.find((opt) => opt.value === value) ?? ""
                              }
                              onChange={(_, newValue) =>
                                onChange(newValue?.value ?? "")
                              }
                              getOptionLabel={(option) => option?.label ?? ""}
                              isOptionEqualToValue={(option, val) =>
                                option.value === val?.value
                              }
                            />
                          );
                        }}
                      />
                    )}
                    {mode !== "edit" && (
                      <Controller
                        name="is_active"
                        control={control}
                        render={({ field: { onChange, value } }) => {
                          const options = [
                            { label: "Aktif", value: true },
                            { label: "Tidak Aktif", value: false },
                          ];
                          return (
                            <CAutoComplete
                              error={!!errors.is_active}
                              disabled={mode === "view"}
                              placeholder="Masukkan status pengguna"
                              label="Status*"
                              options={options}
                              className="w-full"
                              value={
                                options.find((opt) => opt.value === value) ??
                                null
                              }
                              onChange={(_, newValue) =>
                                onChange(newValue?.value ?? null)
                              }
                              getOptionLabel={(option) => option?.label ?? ""}
                              isOptionEqualToValue={(option, val) =>
                                option.value === val?.value
                              }
                            />
                          );
                        }}
                      />
                    )}
                  </div>
                  <div className="w-full flex justify-end">
                    <div className="flex justify-end gap-3 items-center max-w-full w-full">
                      <Button
                        variant="contained"
                        className="w-1/4 !rounded-md !shadow !bg-white !text-gray-500 hover:!bg-gray-100 !border !border-gray-300"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>

                      {mode !== "view" && (
                        <Button
                          type="submit"
                          variant="contained"
                          color="secondary"
                          className="w-1/4 mt-4 !rounded-md"
                          loading={isLoadingCreateUser || isLoadingUpdateUser}
                        >
                          {mode === "create" ? "Buat Akun" : "Update Akun"}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
}
