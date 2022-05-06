const mongoose = require("mongoose");
const essentialSchema = require("./essentialSchema");
const validator = require('validator');
const messageSchema = new mongoose.Schema({
    ...essentialSchema.obj,
    fullName: {
        type: String,
        required: [true, "Please provide your full name"],
    },
    email: {
        type: String,
        required: [true, "Please provide us your email"],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    issue: {
        type: String,
        enum: [
            "Product Related",
            "Order Related",
            "Delivery Related",
            "Business Related",
        ],
        default:"Business Related"
    },
    message: {
        type: String,
        default: "",
    },
});


const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
