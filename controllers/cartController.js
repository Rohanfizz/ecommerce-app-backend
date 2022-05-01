const Cart = require("../models/cartModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { getOne } = require("./handleFactory");

exports.getUserCart = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId })

    if (!cart) {
        cart = await Cart.create({
            userId,
            products: req.body.products,
            subtotal: req.body.subtotal,
        });
    }
    // console.log(cart);
    // cart.products = cart.products.filter((product) => {      // if no product is available
    //     return product.product != null;
    // });
    // console.log(cart);

    await Cart.findByIdAndUpdate(cart._id, cart, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: "success",
        data: {
            cart,
        },
    });
});

exports.createCart = catchAsync(async (req, res, next) => {
    let userId = req.user.id;
    const newCart = await Cart.create({
        userId,
        products: req.body.products,
        subtotal: req.body.subtotal,
    });
    res.status(201).json({
        status: "success",
        data: {
            newCart,
        },
    });
});

exports.cartUpdate = catchAsync(async (req, res, next) => {
    let userId = req.user.id;
    let cart = await Cart.findOneAndUpdate(
        { userId },
        { products: req.body.products, subtotal: req.body.subtotal }
    );
    
    if (!cart) {
        cart = await Cart.create({
            userId,
            products: req.body.products,
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            cart,
        },
    });
});
