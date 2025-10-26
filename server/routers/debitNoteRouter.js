const express = require("express");
const authentication = require("../middlewares/authentication");
const DebitNoteController = require("../controllers/debitNoteController");

const debitNoteRouter = express.Router();

debitNoteRouter.use(authentication);

debitNoteRouter.post("/debit-note", DebitNoteController.createDebitNote);
debitNoteRouter.get("/debit-note", DebitNoteController.getAllDebitNotes);
debitNoteRouter.delete("/debit-note/:id", DebitNoteController.deleteDebitNote);
debitNoteRouter.put("/debit-note/:id", DebitNoteController.updateDebitNote);
debitNoteRouter.get("/debit-note/:id", DebitNoteController.getDebitNoteById);

module.exports = debitNoteRouter;
