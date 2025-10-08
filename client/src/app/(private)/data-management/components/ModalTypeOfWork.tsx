import { Box, Button, IconButton, Modal } from "@mui/material";
import useDataManagement from "../hooks";
import CloseIcon from "@mui/icons-material/Close";
import { Controller } from "react-hook-form";
import { CAutoComplete, CInput } from "@/components/atoms";

export default function ModalTypeOfWork() {
  const {
    openModalTypeOfWork,
    setOpenModalTypeOfWork,
    handleSubmitTypeOfWork,
    errorsTypeOfWork,
    isLoadingCreateTypeOfWork,
    onSubmitTypeOfWork,
    onInvalidTypeOfWork,
    controlTypeOfWork,
  } = useDataManagement();

  const handleClose = () => {
    setOpenModalTypeOfWork(false);
  };
  return (
    <Modal
      open={openModalTypeOfWork}
      onClose={handleClose}
      aria-labelledby="modal-user-profile"
      className="flex justify-center items-center px-4 md:px-40"
    >
      <Box className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Jenis Pekerjaan</h2>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>

        <div className="overflow-y-auto max-h-[80vh] p-6">
          <form
            onSubmit={handleSubmitTypeOfWork(
              onSubmitTypeOfWork,
              onInvalidTypeOfWork
            )}
          >
            <div className="space-y-2 mb-12 text-black">
              <Controller
                name="name"
                control={controlTypeOfWork}
                render={({ field }) => (
                  <CInput
                    {...field}
                    label="Nama*"
                    className="w-full"
                    type="text"
                    placeholder="Masukkan nama"
                    error={!!errorsTypeOfWork.name}
                  />
                )}
              />
              <Controller
                name="type"
                control={controlTypeOfWork}
                render={({ field: { onChange, value } }) => {
                  const options = [
                    { label: "Trade", value: "trade" },
                    { label: "Non Trade", value: "nontrade" },
                  ];
                  return (
                    <CAutoComplete
                      error={!!errorsTypeOfWork.type}
                      label="Tipe*"
                      options={options}
                      className="w-full"
                      placeholder="Masukkan Tipe"
                      value={options.find((opt) => opt.value === value) ?? null}
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

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  className="w-1/4 mt-4 !rounded-md"
                  loading={isLoadingCreateTypeOfWork}
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}
