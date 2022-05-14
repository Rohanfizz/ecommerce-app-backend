const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    searchSuggestions,
    getAdminProducts,
    addStock,
    toggleActiveProduct,
} = require("../controllers/productController");

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/all", protect, restrictTo("seller", "admin"), getProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/",protect, restrictTo("seller", "admin"), addProduct   );
productRouter.patch("/:id",protect, restrictTo("seller", "admin"), updateProduct);
productRouter.patch("/addStock/:id",protect, restrictTo("seller", "admin"),addStock);
productRouter.patch("/toggleActive/:id",protect, restrictTo("seller", "admin"),toggleActiveProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.post("/search", searchSuggestions);

module.exports = productRouter;
