const { default: mongoose } = require("mongoose");
const essentialSchema = require("./essentialSchema");

const cartSchema = new mongoose.Schema(
    {
        ...essentialSchema.obj,
        userId: {
            type: String,
            required: [true, "Please provide a userId for the cart"],
            unique: true,
        },
        products: [
            {
                product: { type: mongoose.Schema.ObjectId, ref: "Product" },
                quantity: {
                    type: Number,
                    required: [true, "A product must have a quantity"],
                },
            },
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

cartSchema.pre(/^find/, function (next) {
    this.populate({
        path: "products",
        populate: {
            path: "product",
            // select: "-info -description -__v -active -createdAt -benefits -suggestedUse",
            select: { price: 1, name: 1, _id: 1, uuid: 1 },
        },
    });
    next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
