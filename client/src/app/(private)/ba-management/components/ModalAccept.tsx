import { Box, Button, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller } from "react-hook-form";
import { CInput } from "@/components/atoms";
import { BlockingLoader } from "@/components/atoms/loader";
import ScannerIcon from "@mui/icons-material/Scanner";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LinkIcon from "@mui/icons-material/Link";
import useBeritaAcara from "../hooks";

export default function ModalAcceptBa() {
  const {
    controlAccepted,
    errorsAccepted,
    openModalAccept,
    setOpenModalAccept,
    handleSubmitAccepted,
    onSubmitAccepted,
    onInvalidAccepted,
    isLoadingApprovedBeritaAcara,
  } = useBeritaAcara();

  const handleClose = () => {
    setOpenModalAccept(false);
  };

  return (
    <Modal
      open={openModalAccept}
      onClose={handleClose}
      aria-labelledby="modal-user-profile"
      className="flex justify-center items-center px-4 md:px-40"
    >
      <Box className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CloudUploadIcon className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Upload Berita Acara
              </h2>
              <p className="text-sm text-gray-600">
                Scan dan upload dokumen BA
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

        {isLoadingApprovedBeritaAcara && <BlockingLoader />}

        <div className="overflow-y-auto max-h-[80vh] p-6">
          {/* Instructional Banner */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <InfoOutlinedIcon className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Panduan Upload Dokumen:
                </h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">1.</span>
                    <span className="flex items-center gap-2">
                      <ScannerIcon fontSize="small" className="text-blue-600" />
                      Scan dokumen Berita Acara yang telah ditandatangani
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">2.</span>
                    <span className="flex items-center gap-2">
                      <CloudUploadIcon
                        fontSize="small"
                        className="text-blue-600"
                      />
                      Upload file hasil scan ke Google Drive
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">3.</span>
                    <span className="flex items-center gap-2">
                      <LinkIcon fontSize="small" className="text-blue-600" />
                      Copy link sharing dan paste di form di bawah
                    </span>
                  </li>
                </ol>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-gray-600 italic">
                    💡 Pastikan file dapat diakses oleh siapa saja yang memiliki
                    link
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmitAccepted(onSubmitAccepted, onInvalidAccepted)}
          >
            <div className="space-y-2 mb-8">
              <Controller
                name="link_doc"
                control={controlAccepted}
                render={({ field }) => (
                  <div className="relative">
                    <div className="absolute left-3 top-[42px] transform -translate-y-1/2 text-gray-400">
                      <LinkIcon fontSize="small" />
                    </div>
                    <CInput
                      {...field}
                      label="Link Google Drive Dokumen BA*"
                      className="w-full pl-10"
                      type="text"
                      placeholder="https://drive.google.com/file/d/..."
                      error={!!errorsAccepted.link_doc}
                    />
                  </div>
                )}
              />
              {errorsAccepted.link_doc && (
                <p className="text-sm text-red-600 mt-1">
                  {errorsAccepted.link_doc.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outlined" onClick={handleClose}>
                Batal
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="!text-xs"
              >
                Simpan Dokumen
              </Button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}
