import { Box, Button, IconButton, Modal } from "@mui/material";
import useDataManagement from "../hooks";
import CloseIcon from "@mui/icons-material/Close";
import { Controller } from "react-hook-form";
import { CInput } from "@/components/atoms";
import { TextArea } from "@/components/atoms/Input-text-area";

export default function ModalCustomer() {
  const {
    openModalCustomer,
    setOpenModalCustomer,
    handleSubmitCustomer,
    errorsCustomer,
    isLoadingCreateCustomer,
    onSubmitCustomer,
    onInvalidCustomer,
    controlCustomer,
  } = useDataManagement();

  const handleClose = () => {
    setOpenModalCustomer(false);
  };
  return (
    <Modal
      open={openModalCustomer}
      onClose={handleClose}
      aria-labelledby="modal-user-profile"
      className="flex justify-center items-center px-4 md:px-40"
    >
      <Box className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Customer</h2>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>

        <div className="overflow-y-auto max-h-[80vh] p-6">
          <form
            onSubmit={handleSubmitCustomer(onSubmitCustomer, onInvalidCustomer)}
          >
            <div className="space-y-2 mb-12 text-black">
              <Controller
                name="name"
                control={controlCustomer}
                render={({ field }) => (
                  <CInput
                    {...field}
                    label="Nama*"
                    className="w-full"
                    type="text"
                    placeholder="Masukkan nama"
                    error={!!errorsCustomer.name}
                  />
                )}
              />
              <Controller
                name="code"
                control={controlCustomer}
                render={({ field }) => (
                  <CInput
                    {...field}
                    label="Code*"
                    className="w-full"
                    type="text"
                    placeholder="Masukkan code"
                    error={!!errorsCustomer.code}
                  />
                )}
              />
              <Controller
                name="phone"
                control={controlCustomer}
                render={({ field }) => (
                  <CInput
                    {...field}
                    label="Phone*"
                    className="w-full"
                    type="text"
                    placeholder="Masukkan phone"
                    error={!!errorsCustomer.phone}
                  />
                )}
              />
              <Controller
                name="alamat"
                control={controlCustomer}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    label="Alamat*"
                    placeholder="Jl. Contoh No. Contoh"
                    className="w-full"
                    error={!!errorsCustomer.alamat}
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
                  loading={isLoadingCreateCustomer}
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
