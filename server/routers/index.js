const express = require("express");
const userRouter = require("./userRouter");
const departmentRouter = require("./departmenRouter");

const router = express.Router();

router.use("/", userRouter);
router.use("/", departmentRouter);

module.exports = router;
