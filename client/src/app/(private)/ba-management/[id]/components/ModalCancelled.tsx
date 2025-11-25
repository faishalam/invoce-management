import { Box, Button, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller } from "react-hook-form";
import { BlockingLoader } from "@/components/atoms/loader";
import EditNoteIcon from "@mui/icons-material/EditNote";
import useBeritaAcara from "../../hooks";
import { TextArea } from "@/components/atoms/Input-text-area";

export default function ModalCancelled() {
  const {
    openModalCancelled,
    setOpenModalCancelled,
    controlCancelled,
    handleSubmitCancelled,
    errorsCancelled,
    onSubmitCancelled,
    onInvalidCancelled,
    isLoadingCancelledBeritaAcara,
  } = useBeritaAcara();

  const handleClose = () => {
    setOpenModalCancelled(false);
  };

  return (
    <Modal
      open={openModalCancelled}
      onClose={handleClose}
      aria-labelledby="modal-user-profile"
      className="flex justify-center items-center px-4 md:px-40"
    >
      <Box className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <EditNoteIcon className="text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Cancel Berita Acara
              </h2>
              <p className="text-sm text-gray-600">
                Berikan alasan cancel dokumen BA
              </p>
            </div>
          </div>
          <IconButton
            onClick={handleClose}
            size="small"
            className="hover:bg-white/50"
          >
            <CloseIcon />
          </IconButton>
        </div>

        {isLoadingCancelledBeritaAcara && <BlockingLoader />}

        <div className="overflow-y-auto max-h-[80vh] p-6">
          {/* Form */}
          <form
            onSubmit={handleSubmitCancelled(
              onSubmitCancelled,
              onInvalidCancelled
            )}
          >
            <div className="space-y-2 mb-8">
              <Controller
                name="cancelled.reason"
                control={controlCancelled}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    label="Alasan Cancel*"
                    placeholder="Contoh: Terdapat kesalahan pada nomor dokumen, tanggal tidak sesuai, tanda tangan belum lengkap, dll."
                    className="w-full"
                    rows={5}
                    error={!!errorsCancelled?.cancelled?.reason}
                  />
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={isLoadingCancelledBeritaAcara}
              >
                Batal
              </Button>

              <Button
                type="submit"
                variant="contained"
                className="!bg-orange-600 hover:!bg-orange-700 !text-white"
                disabled={isLoadingCancelledBeritaAcara}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}
