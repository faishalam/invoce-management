const express = require("express");
const authentication = require("../middlewares/authentication");
const CustomerController = require("../controllers/customerController");

const customerRouter = express.Router();

customerRouter.use(authentication);

customerRouter.post("/customer", CustomerController.createCustomer);
customerRouter.get("/customer", CustomerController.getAllCustomer);
customerRouter.delete("/customer/:id", CustomerController.deleteCustomer);
customerRouter.put("/customer/:id", CustomerController.updateCustomer);

module.exports = customerRouter;
