const express = require("express");
const authentication = require("../middlewares/authentication");
const TemplateBeritaAcaraController = require("../controllers/templateBeritaAcaraController");

const templateBeritaAcaraRouter = express.Router();

templateBeritaAcaraRouter.use(authentication);

templateBeritaAcaraRouter.post(
  "/template-berita-acara",
  TemplateBeritaAcaraController.createTemplateBeritaAcara
);
templateBeritaAcaraRouter.put(
  "/template-berita-acara/:id",
  TemplateBeritaAcaraController.updateTemplateBeritaAcara
);

module.exports = templateBeritaAcaraRouter;
