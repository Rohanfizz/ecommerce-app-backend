const { default: mongoose } = require("mongoose");
const essentialSchema = require("./essentialSchema");

const cartSchema = new mongoose.Schema(
    {
        ...essentialSchema.obj,
        userId: {
            type: String,
            required: [true, "Please provide a userId for the cart"],
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
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                // ret._id = ret._id;
                delete ret._id;
            },
        },
        toObject: { virtuals: true },
    }
);

cartSchema.pre(/^find/, function (next) {
    this.populate({
        path: "products",
        select: { price: 1, name: 1, productImage: 1, _id: 1 },
    });
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
