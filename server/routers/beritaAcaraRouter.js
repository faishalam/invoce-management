const express = require("express");
const authentication = require("../middlewares/authentication");
const BeritaAcaraController = require("../controllers/beritaAcaraController");

const beritaAcaraRouter = express.Router();

beritaAcaraRouter.use(authentication);

beritaAcaraRouter.post(
  "/berita-acara",
  BeritaAcaraController.createBeritaAcara
);
beritaAcaraRouter.get("/berita-acara", BeritaAcaraController.getAllBeritaAcara);
beritaAcaraRouter.get(
  "/berita-acara-calculate",
  BeritaAcaraController.getAllCalculate
);
beritaAcaraRouter.get(
  "/berita-acara-waiting",
  BeritaAcaraController.getBeritaAcaraWaiting
);
beritaAcaraRouter.put(
  "/berita-acara-approved/:id",
  BeritaAcaraController.beritaAcaraAcepted
);
beritaAcaraRouter.delete(
  "/berita-acara/:id",
  BeritaAcaraController.deleteBeritaAcara
);
beritaAcaraRouter.put(
  "/berita-acara/:id",
  BeritaAcaraController.updateBeritaAcara
);
beritaAcaraRouter.get(
  "/berita-acara/:id",
  BeritaAcaraController.getBeritaAcaraById
);
beritaAcaraRouter.patch(
  "/berita-acara-status/:id",
  BeritaAcaraController.updateStatus
);
beritaAcaraRouter.patch(
  "/berita-acara-cancelled/:id",
  BeritaAcaraController.cancelledBeritaAcara
);
beritaAcaraRouter.patch(
  "/berita-acara-delivery/:id",
  BeritaAcaraController.deliveryBeritaAcara
);

module.exports = beritaAcaraRouter;
