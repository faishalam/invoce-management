import { Box, Button, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller } from "react-hook-form";
import { BlockingLoader } from "@/components/atoms/loader";
import EditNoteIcon from "@mui/icons-material/EditNote";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import useBeritaAcara from "../../hooks";
import { TextArea } from "@/components/atoms/Input-text-area";

export default function ModalRevised() {
  const {
    setOpenModalRevised,
    openModalRevised,
    controlRevised,
    handleSubmitRevised,
    errorsRevised,
    onSubmitRevised,
    isLoadingUpdateStatus,
    onInvalidRevised,
  } = useBeritaAcara();

  const handleClose = () => {
    setOpenModalRevised(false);
  };

  return (
    <Modal
      open={openModalRevised}
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
                Revisi Berita Acara
              </h2>
              <p className="text-sm text-gray-600">
                Berikan alasan revisi dokumen BA
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

        {isLoadingUpdateStatus && <BlockingLoader />}

        <div className="overflow-y-auto max-h-[80vh] p-6">
          {/* Instructional Banner */}
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex gap-3">
              <WarningAmberIcon className="text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Informasi Revisi:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Dokumen akan dikembalikan ke status Revisi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>
                      Jelaskan dengan detail mengapa dokumen perlu diperbaiki
                    </span>
                  </li>
                </ul>
                <div className="mt-3 pt-3 border-t border-orange-200">
                  <p className="text-xs text-gray-600 italic">
                    💡 Alasan revisi akan terkirim ke pembuat dokumen
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmitRevised(onSubmitRevised, onInvalidRevised)}
          >
            <div className="space-y-2 mb-8">
              <Controller
                name="revised.reason"
                control={controlRevised}
                render={({ field }) => (
                  <TextArea
                    label="Alasan Revisi*"
                    placeholder="Contoh: Terdapat kesalahan pada nomor dokumen, tanggal tidak sesuai, tanda tangan belum lengkap, dll."
                    className="w-full"
                    rows={5}
                    error={!!errorsRevised?.revised?.reason}
                    helperText={errorsRevised?.revised?.reason?.message}
                    {...field}
                  />
                )}
              />
              <p className="text-xs text-gray-500 mt-1">
                Jelaskan secara spesifik bagian yang perlu diperbaiki agar user
                dapat melakukan revisi dengan tepat
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={isLoadingUpdateStatus}
              >
                Batal
              </Button>

              <Button
                type="submit"
                variant="contained"
                className="!bg-orange-600 hover:!bg-orange-700 !text-white"
                disabled={isLoadingUpdateStatus}
              >
                Kirim Revisi
              </Button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}
