const Product = require("../models/productModel");
const { catchAsync } = require("../utils/catchAsync");
const {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne,
} = require("./handleFactory");

exports.getProducts = getAll(Product);
exports.getProductById = getOne(Product);
exports.addProduct = createOne(Product);
exports.updateProduct = updateOne(Product);
exports.deleteProduct = deleteOne(Product);
