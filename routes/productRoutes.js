const express = require("express");
const { getProducts, addProduct, updateProduct, deleteProduct, getProductById } = require("../controllers/productController");

const productRouter = express.Router();

productRouter.get('/',getProducts);
productRouter.get('/:id',getProductById);
productRouter.post('/',addProduct);
productRouter.patch('/:id',updateProduct);
productRouter.delete('/:id',deleteProduct);

module.exports = productRouter;