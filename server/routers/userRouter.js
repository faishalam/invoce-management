const express = require("express");
const UserController = require("../controllers/userControllers");
const authentication = require("../middlewares/authentication");
const userRouter = express.Router();

userRouter.post("/login", UserController.login);
userRouter.use(authentication);
userRouter.post("/register", UserController.createUser);
userRouter.get("/profile", UserController.profile);
userRouter.put("/profile", UserController.updateProfile);
userRouter.delete("/profile", UserController.deleteProfile);
userRouter.patch("/change-password", UserController.changePassword);
userRouter.get("/users", UserController.getAllUsers);
userRouter.get("/user/:id", UserController.getUserById);

module.exports = userRouter;
