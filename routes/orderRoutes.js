const express = require('express');
const { protect } = require('../controllers/authController');
const { getUserOrders, placeOrder, invoiceGenerator, getOrderById } = require('../controllers/orderController');

const orderRouter = express.Router();

orderRouter.get("/",protect,getUserOrders);
orderRouter.get("/:orderId",getOrderById);
orderRouter.post("/",protect,placeOrder);
orderRouter.get("/invoice/:orderId",protect,invoiceGenerator)

module.exports = orderRouter;