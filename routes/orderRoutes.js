const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
    getUserOrders,
    placeOrder,
    invoiceGenerator,
    getOrderById,
    getAllOrders,
    moveStage,
} = require("../controllers/orderController");

const orderRouter = express.Router();

orderRouter.get("/", protect, getUserOrders);
orderRouter.get("/all", protect, restrictTo("seller", "admin"), getAllOrders);
orderRouter.get("/:orderId", getOrderById);
orderRouter.post("/", protect, placeOrder);
orderRouter.get("/invoice/:orderId", protect, invoiceGenerator);

orderRouter.patch("/move/:id",protect,restrictTo("seller", "admin"),moveStage);


module.exports = orderRouter;
