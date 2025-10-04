const express = require("express");
const UserController = require("../controllers/userControllers");
const authentication = require("../middlewares/authentication");
const userRouter = express.Router();

userRouter.post("/register", UserController.createUser);
userRouter.post("/login", UserController.login);
userRouter.get(
  "/getLoggedInUser",
  authentication,
  UserController.getLoggedInUser
);

module.exports = userRouter;
