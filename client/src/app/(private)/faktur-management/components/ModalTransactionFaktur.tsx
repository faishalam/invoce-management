import { Box, Button, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller } from "react-hook-form";
import { CInput } from "@/components/atoms";
import { BlockingLoader } from "@/components/atoms/loader";
import useFaktur from "../hooks";

export default function ModalTransactionFaktur() {
  const {
    handleSubmitTransaction,
    controlTransaction,
    onSubmitTransaction,
    errorsTransaction,
    onInvalidTransaction,
    isLoadingTransactionFaktur,
    openModalTransaction,
    setOpenModalTransaction,
  } = useFaktur();

  const handleClose = () => {
    setOpenModalTransaction(false);
  };
  return (
    <Modal
      open={openModalTransaction}
      onClose={handleClose}
      aria-labelledby="modal-user-profile"
      className="flex justify-center items-center px-4 md:px-40"
    >
      <Box className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Faktur Transaction
          </h2>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>
        {isLoadingTransactionFaktur && <BlockingLoader />}

        <div className="overflow-y-auto max-h-[80vh] p-6">
          <form
            onSubmit={handleSubmitTransaction(
              onSubmitTransaction,
              onInvalidTransaction
            )}
          >
            <div className="space-y-2 mb-12 text-black">
              <Controller
                name="transaction_id"
                control={controlTransaction}
                render={({ field }) => (
                  <CInput
                    {...field}
                    label="Transaction ID*"
                    type="text"
                    error={!!errorsTransaction.transaction_id}
                    placeholder="Masukkan transaction id yang anda terima"
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
