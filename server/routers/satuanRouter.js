const express = require("express");
const authentication = require("../middlewares/authentication");
const SatuanController = require("../controllers/satuanController");

const satuanRouter = express.Router();

satuanRouter.use(authentication);

satuanRouter.post("/satuan", SatuanController.createSatuan);
satuanRouter.get("/satuan", SatuanController.getAllSatuan);
satuanRouter.delete("/satuan/:id", SatuanController.deleteSatuan);
satuanRouter.put("/satuan/:id", SatuanController.updateSatuan);

module.exports = satuanRouter;
