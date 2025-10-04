import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ModalImportProps } from "./types";
import { Alert, Button, Link } from "@mui/material";
import { Upload } from "@mui/icons-material";

export default function ModalImportInquiry({
  open,
  setOpen,
}: ModalImportProps) {
  

  return (
    <div>
      <Modal
        open={open}
        onClose={setOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className=" w-full flex justify-center items-center px-40"
      >
        <Box className=" w-full bg-white rounded-md">
          <div className="w-full flex justify-between">
            <p className="font-semibold text-xl p-5">Import Inquiry </p>
            <div className=" justify-end border-t-2 px-6 py-2 gap-2">
              <Alert severity="info" color="success" style={{ padding: "1px 14px "}}>
                Please download excel template on 
                <Link href={"/"}> <b>here.</b> </Link>
              </Alert>
            </div>
          </div>

          <div className="w-full flex items-center justify-end border-t-2 px-6 py-2 gap-2">

            <Button 
            variant="outlined"
            onClick={() => setOpen(false)}
            >
                Cancel
            </Button>

            <Button variant="contained" color="success" startIcon={<Upload />}>
                Upload
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
