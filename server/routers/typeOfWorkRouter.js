const express = require("express");
const authentication = require("../middlewares/authentication");
const TypeOfWorkController = require("../controllers/typeOfWorkController");

const typeOfWorkRouter = express.Router();

typeOfWorkRouter.use(authentication);

typeOfWorkRouter.post("/typeOfWork", TypeOfWorkController.createTypeOfWork);
typeOfWorkRouter.get("/typeOfWork", TypeOfWorkController.getAllTypeOfWork);
typeOfWorkRouter.delete(
  "/typeOfWork/:id",
  TypeOfWorkController.deleteTypeOfWork
);
typeOfWorkRouter.put("/typeOfWork/:id", TypeOfWorkController.updateTypeOfWork);

module.exports = typeOfWorkRouter;
