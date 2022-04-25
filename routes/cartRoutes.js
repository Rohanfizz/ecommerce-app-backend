const express = require("express");
const { protect } = require("../controllers/authController");
const { cartUpdate } = require("../controllers/cartController");

const cartRouter = express.Router();

cartRouter.patch("/update",protect, cartUpdate);


module.exports = cartRouter;