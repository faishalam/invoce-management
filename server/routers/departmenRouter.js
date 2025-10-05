const express = require("express");
const authentication = require("../middlewares/authentication");
const DepartmentController = require("../controllers/departmentControllers");

const departmentRouter = express.Router();

departmentRouter.use(authentication);

// CRUD Department
departmentRouter.post("/department", DepartmentController.createDepartment); // create
departmentRouter.get("/department", DepartmentController.getAllDepartments);
departmentRouter.get("/department/:id", DepartmentController.getDepartmentById);
departmentRouter.put("/department/:id", DepartmentController.updateDepartment); // update
departmentRouter.delete(
  "/department/:id",
  DepartmentController.deleteDepartment
); // delete

module.exports = departmentRouter;
