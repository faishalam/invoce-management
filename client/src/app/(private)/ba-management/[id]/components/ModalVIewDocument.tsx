import { Box, Button, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useBeritaAcara from "../../hooks";
import { useRef } from "react";

export default function ModalViewDocument() {
  const { openModalDocument, setOpenModalDocument, dataBeritaAcaraById } =
    useBeritaAcara();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleClose = () => {
    setOpenModalDocument(false);
  };

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.print();
      } catch (error) {
        console.error("Error printing:", error);
        // Fallback: open in new window and print
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 250);
        }
      }
    }
  };

  const htmlContent =
    dataBeritaAcaraById?.data?.template_berita_acara?.html_rendered || "";

  return (
    <>
      <Modal
        open={openModalDocument}
        onClose={handleClose}
        aria-labelledby="modal-user-profile"
        className="flex justify-center items-center"
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
          },
        }}
      >
        <Box
          sx={{
            width: "210mm",
            maxHeight: "95vh",
            overflow: "auto",
            outline: "none",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: 24,
          }}
        >
          {/* Action Bar */}
          <div className="flex justify-between items-center px-4 py-2 mb-4 bg-white rounded-lg shadow-sm">
            <Button
              variant="contained"
              onClick={handlePrint}
              size="small"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Print
            </Button>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </div>

          {/* A4 Paper Container with iframe */}
          <div
            className="bg-white shadow-lg"
            style={{
              width: "100%",
              minHeight: "297mm",
              boxSizing: "border-box",
            }}
          >
            {htmlContent ? (
              <iframe
                ref={iframeRef}
                srcDoc={htmlContent}
                sandbox="allow-same-origin allow-modals allow-popups"
                style={{
                  width: "100%",
                  height: "297mm",
                  border: "none",
                  display: "block",
                  backgroundColor: "white",
                }}
                title="Document Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">
                  Tidak ada dokumen untuk ditampilkan
                </p>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
}
