const express = require("express");
const authentication = require("../middlewares/authentication");
const GoodsController = require("../controllers/goodsController");

const goodsRouter = express.Router();

goodsRouter.use(authentication);

goodsRouter.post("/goods", GoodsController.createGoods);
goodsRouter.get("/goods", GoodsController.getAllGoods);
goodsRouter.delete("/goods/:id", GoodsController.deleteGoods);
goodsRouter.put("/goods/:id", GoodsController.updateGoods);

module.exports = goodsRouter;
