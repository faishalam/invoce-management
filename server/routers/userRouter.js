const express = require("express");
const UserController = require("../controllers/userControllers");
const authentication = require("../middlewares/authentication");
const userRouter = express.Router();

userRouter.post("/login", UserController.login);
userRouter.use(authentication);
userRouter.post("/users", UserController.createUser);
userRouter.get("/profile", UserController.profile);
userRouter.get("/users", UserController.getAllUsers);
userRouter.put("/users/:id", UserController.updateUser);
userRouter.delete("/users/:id", UserController.deleteUser);
userRouter.patch("/change-password", UserController.changePassword);
userRouter.get("/users/:id", UserController.getUserById);

module.exports = userRouter;
