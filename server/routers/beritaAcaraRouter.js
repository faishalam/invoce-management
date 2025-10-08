const express = require("express");
const authentication = require("../middlewares/authentication");
const BeritaAcaraController = require("../controllers/beritaAcaraController");

const beritaAcaraRouter = express.Router();

beritaAcaraRouter.use(authentication);

beritaAcaraRouter.post("/berita-acara", BeritaAcaraController.createBeritaAcara);
beritaAcaraRouter.get("/berita-acara", BeritaAcaraController.getAllBeritaAcara);
beritaAcaraRouter.delete("/berita-acara/:id", BeritaAcaraController.deleteBeritaAcara);
beritaAcaraRouter.put("/berita-acara/:id", BeritaAcaraController.updateBeritaAcara);
beritaAcaraRouter.get("/berita-acara/:id", BeritaAcaraController.getBeritaAcaraById);

module.exports = beritaAcaraRouter;
