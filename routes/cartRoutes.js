const express = require("express");
const { protect } = require("../controllers/authController");
const { cartUpdate, createCart,  getUserCart } = require("../controllers/cartController");

const cartRouter = express.Router();

cartRouter.get("/",protect,getUserCart);
cartRouter.post("/create", protect, createCart);
cartRouter.patch("/update", protect, cartUpdate);

module.exports = cartRouter;
