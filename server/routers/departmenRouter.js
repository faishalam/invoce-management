const express = require("express");
const authentication = require("../middlewares/authentication");
const DepartmentController = require("../controllers/departmentControllers");

const departmentRouter = express.Router();

departmentRouter.use(authentication);

// CRUD Department
departmentRouter.post("/department", DepartmentController.createDepartment);
departmentRouter.get("/department", DepartmentController.getAllDepartments);
departmentRouter.delete(
  "/department/:id",
  DepartmentController.deleteDepartment
);
departmentRouter.put("/department/:id", DepartmentController.updateDepartment);

module.exports = departmentRouter;
