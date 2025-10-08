import { Box, Button, IconButton, Modal } from "@mui/material";
import useDataManagement from "../hooks";
import CloseIcon from "@mui/icons-material/Close";
import { Controller } from "react-hook-form";
import { CInput } from "@/components/atoms";

export default function ModalDepartment() {
  const {
    openModalDepartment,
    setOpenModalDepartment,
    handleSubmitDepartment,
    errorsDepartment,
    isLoadingCreateDepartment,
    onSubmitDepartment,
    onInvalidDepartment,
    controlDepartment,
  } = useDataManagement();

  const handleClose = () => {
    setOpenModalDepartment(false);
  };
  return (
    <Modal
      open={openModalDepartment}
      onClose={handleClose}
      aria-labelledby="modal-user-profile"
      className="flex justify-center items-center px-4 md:px-40"
    >
      <Box className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Department</h2>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>

        <div className="overflow-y-auto max-h-[80vh] p-6">
          <form
            onSubmit={handleSubmitDepartment(
              onSubmitDepartment,
              onInvalidDepartment
            )}
          >
            <div className="space-y-2 mb-12 text-black">
              <Controller
                name="name"
                control={controlDepartment}
                render={({ field }) => (
                  <CInput
                    {...field}
                    label="Nama*"
                    className="w-full"
                    type="text"
                    placeholder="Masukkan nama"
                    error={!!errorsDepartment.name}
                  />
                )}
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
                  loading={isLoadingCreateDepartment}
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
