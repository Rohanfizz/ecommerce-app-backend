const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "A product must have a name!"],
        },
        primaryCategory: {
            type: String,
            required: [true, "A product must have a category"],
        },
        ratingNumber: {
            type: Number,
            default: 4.5,
            max: [5, "A tour must have rating less or equal than 5"],
            min: [1, "A tour must have rating greater or equal than 1"],
            set: (val) => Math.round(val * 10) / 10,
        },
        ratingQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "A Product must have a price!"],
        },
        originalPrice: {
            type: Number,
            required: [true, "A Product must have a price!"],
            validate: {
                validator: function (val) {
                    return val >= this.price;
                },
                message:
                    "Oriinal price should be equal to or above regular price",
            },
        },
        stockStatus: {
            type: Boolean,
            default: true,
            required: [true, "A product must have stock status"],
        },
        productImage: [String],
        description: {
            type: String,
            required: [true, "A product must have Description"],
        },
        benefits: {
            type: String,
            required: [true, "A product must have benefits"],
        },
        suggestedUse: {
            type: String,
            required: [true, "A product must have Suggested Use"],
        },
        info: {
            type: mongoose.SchemaTypes.Mixed,
            required: [true, "A product must have Info"],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// productSchema.virtual('reviews', {
//     ref: 'Review',
//     foreignField: 'tour',
//     localField: '_id',
//   });
  
const Product = mongoose.model("Product", productSchema);
module.exports = Product;