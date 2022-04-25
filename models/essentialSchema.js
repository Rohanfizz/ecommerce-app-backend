const { default: mongoose } = require("mongoose");
const { v4 } = require("uuid");

const essentialSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: v4(),
        unique: true,
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
});

module.exports = essentialSchema;