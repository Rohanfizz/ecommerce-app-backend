const { default: mongoose } = require("mongoose");
const { stringify } = require("uuid");
const Cart = require("./cartModel");
const essentialSchema = require("./essentialSchema");
const validator = require("validator");
const { v4 } = require("uuid");
const ShortUniqueId = require("short-unique-id");

const orderSchema = new mongoose.Schema(
    {
        ...essentialSchema.obj,
        shipmentInfo: {
            firstName: {
                type: String,
                required: [true, "Please tell us your first name!"],
            },
            lastName: {
                type: String,
            },
            email: {
                type: String,
                required: [true, "Please provide us your email"],
                lowercase: true,
                validate: [validator.isEmail, "Please provide a valid email"],
            },
            phone: {
                type: String,
                required: [true, "Please provide your phone number"],
                validate: {
                    validator: function (val) {
                        return val.length === 10;
                    },
                    message: "Invalid Phone Number!",
                },
            },
            zipCode: {
                type: String,
                required: [true, "Please provide your zip code"],
            },
            city: {
                type: String,
                required: [true, "Please provide your city"],
            },
            streetAddress: {
                type: String,
                required: [true, "Please provide your street address"],
            },
        },
        orderStatus: {
            type: String,
            enum: [
                "placed",
                "cancelled",
                "dispatched",
                "completed",
                "refunded",
                "failed",
            ],
            default: "placed",
        },
        paymentDone: {
            type: Boolean,
            default: false,
        },
        paymentMode: {
            type: String,
            enum: ["Cash On Delivery", "STRIPE"],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "A order must have a placer"],
            ref: "User",
        },
        cart: {
            products: [
                {
                    product: { type: mongoose.Schema.ObjectId, ref: "Product" },
                    quantity: {
                        type: Number,
                        required: [true, "A product must have a quantity"],
                    },
                },
            ],
            subtotal: {
                type: Number,
                default: 0,
                required: [true, "A cart must have a subtotal"],
            },
        },
        tax: {
            type: Number,
            required: [true, "Order must have a tax figure"],
            default: 0,
        },
        delivery: {
            type: Number,
            required: [true, "Order must have a delivery charge"],
            default: 0,
        },
        totalPrice: {
            type: Number,
            required: [true, "Order must have a total price"],
            default: 0,
        },
        invoice: {
            type: String,
            default: () => {return new ShortUniqueId({length: 5})()},
        },  
    },
    {
        toJSON: {
            virtuals: true,
            // transform: function (doc, ret) {
            //     // ret._id = ret._id;
            //     delete ret._id;
            // },
        },
        toObject: { virtuals: true },
    }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
