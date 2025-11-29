import { Box, Button, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller } from "react-hook-form";
import { BlockingLoader } from "@/components/atoms/loader";
import EditNoteIcon from "@mui/icons-material/EditNote";
import useBeritaAcara from "../../hooks";
import { CInput } from "@/components/atoms";

export default function ModalDelivery() {
  const {
    openModalDelivery,
    setOpenModalDelivery,
    controlDelivery,
    handleSubmitDelivery,
    errorsDelivery,
    onSubmitDelivery,
    onInvalidDelivery,
    isLoadingDeliveryBeritaAcara,
    dataBeritaAcaraById,
  } = useBeritaAcara();

  const handleClose = () => {
    setOpenModalDelivery(false);
  };

  return (
    <Modal
      open={openModalDelivery}
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
                Informasi Pengiriman
              </h2>
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

        {isLoadingDeliveryBeritaAcara && <BlockingLoader />}

        <div className="overflow-y-auto max-h-[80vh] p-6">
          {/* Form */}
          <form
            onSubmit={handleSubmitDelivery(onSubmitDelivery, onInvalidDelivery)}
          >
            <div className="space-y-2 mb-8">
              <Controller
                name="delivery.resi"
                control={controlDelivery}
                render={({ field }) => (
                  <CInput
                    {...field}
                    label="No.Resi*"
                    placeholder="xxxxxxxxxxxxxx"
                    className="w-full"
                    disabled={dataBeritaAcaraById?.data?.delivery !== null}
                    error={!!errorsDelivery?.delivery?.resi}
                  />
                )}
              />

              <Controller
                name="delivery.nama_pengirim"
                control={controlDelivery}
                render={({ field }) => (
                  <CInput
                    {...field}
                    label="Nama Pengirim*"
                    placeholder="Masukkan nama pengirim"
                    className="w-full"
                    disabled={dataBeritaAcaraById?.data?.delivery !== null}
                    error={!!errorsDelivery?.delivery?.nama_pengirim}
                  />
                )}
              />

              <Controller
                name="delivery.metode"
                control={controlDelivery}
                render={({ field }) => (
                  <CInput
                    {...field}
                    label="Metode*"
                    placeholder="contoh: melalui kurir"
                    disabled={dataBeritaAcaraById?.data?.delivery !== null}
                    className="w-full"
                    error={!!errorsDelivery?.delivery?.metode}
                  />
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={isLoadingDeliveryBeritaAcara}
              >
                Batal
              </Button>
              {dataBeritaAcaraById?.data?.delivery === null && (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoadingDeliveryBeritaAcara}
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}
