const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const { catchAsync } = require("../utils/catchAsync");

exports.placeOrder = catchAsync(async (req, res, next) => {
    const order = req.body;
    //check the availability of products
    const cart = order.cart;

    const allProductsInCart = await Promise.all(
        cart.products.map((ele) => {
            return Product.findById(ele.product).select({ name: 1, stock: 1 });
        })
    );

    let outOfStockItems = [];
    cart.products.forEach((ele, idx) => {
        if (ele.quantity > allProductsInCart[idx].stock) {
            outOfStockItems.push(allProductsInCart[idx]);
        }
    });

    // if not available, send error response
    if (outOfStockItems.length > 0) {
        res.status(400).json({
            status: "failure",
            data: {
                outOfStockItems,
            },
        });
    }
    // if available create new order document

    const newOrder = await Order.create({ ...order, userId: req.user._id });

    // subtract from stock
    await Promise.all(
        cart.products.map((ele) => {
            return Product.findByIdAndUpdate(ele.product, {
                $inc: { stock: -ele.quantity },
            });
        })
    );

    res.status(202).json({
        status: "success",
        data: newOrder,
    });
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ userId: req.user._id });
    res.status(200).json({
        status: "success",
        data: {
            orders,
        },
    });
});
