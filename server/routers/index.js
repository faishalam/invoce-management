const express = require("express");
const userRouter = require("./userRouter");
const departmentRouter = require("./departmenRouter");
const satuanRouter = require("./satuanRouter");
const typeOfWorkRouter = require("./typeOfWorkRouter");
const customerRouter = require("./customerRouter");
const goodsRouter = require("./goodsRouter");
const beritaAcaraRouter = require("./beritaAcaraRouter");

const router = express.Router();

router.use("/", userRouter);
router.use("/", departmentRouter);
router.use("/", satuanRouter);
router.use("/", typeOfWorkRouter);
router.use("/", customerRouter);
router.use("/", goodsRouter);
router.use("/", beritaAcaraRouter);

module.exports = router;
