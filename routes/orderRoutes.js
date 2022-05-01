const express = require('express');
const { protect } = require('../controllers/authController');
const { getUserOrders, placeOrder } = require('../controllers/orderController');

const orderRouter = express.Router();

orderRouter.get("/",protect,getUserOrders);
orderRouter.post("/",protect,placeOrder);

module.exports = orderRouter;