const express = require("express");
const authentication = require("../middlewares/authentication");
const FakturController = require("../controllers/fakturController");

const FakturRouter = express.Router();

FakturRouter.use(authentication);

FakturRouter.post("/faktur", FakturController.createFaktur);
FakturRouter.get("/faktur", FakturController.getAllFaktur);
FakturRouter.delete("/faktur/:id", FakturController.deleteFaktur);
FakturRouter.put("/faktur/:id", FakturController.updateFaktur);
FakturRouter.get("/faktur/:id", FakturController.fakturById);
FakturRouter.put("/faktur-accepted/:id", FakturController.acceptedFaktur);
FakturRouter.put("/faktur-transaction/:id", FakturController.transactionFaktur);

module.exports = FakturRouter;
