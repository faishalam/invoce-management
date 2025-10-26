const express = require("express");
const authentication = require("../middlewares/authentication");
const TemplateDebitNoteController = require("../controllers/templateDebitNoteController");

const templateDebitNoteRouter = express.Router();

templateDebitNoteRouter.use(authentication);

templateDebitNoteRouter.post(
  "/template-debit-note",
  TemplateDebitNoteController.createTemplateDebitNote
);
templateDebitNoteRouter.put(
  "/template-debit-note/:id",
  TemplateDebitNoteController.updateTemplateDebitNote
);

module.exports = templateDebitNoteRouter;
