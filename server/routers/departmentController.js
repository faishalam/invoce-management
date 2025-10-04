const express = require("express");
const DepartmentController = require("../controllers/departmentController");
const authentication = require("../middlewares/authentication");

const departmentRouter = express.Router();

departmentRouter.use(authentication);

// CRUD Department
departmentRouter.post("/department", DepartmentController.createDepartment); // create
departmentRouter.get("/department", DepartmentController.getAllDepartments);
departmentRouter.get("/department/:id", DepartmentController.getDepartmentById);
department; /// read one
departmentRouter.put("/department/:id", DepartmentController.updateDepartment); // update
departmentRouter.delete(
  "/department/:id",
  DepartmentController.deleteDepartment
); // delete

module.exports = departmentRouter;
