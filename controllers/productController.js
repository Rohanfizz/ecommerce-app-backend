const Product = require("../models/productModel");
const { catchAsync } = require("../utils/catchAsync");
const {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne,
} = require("./handleFactory");
const AppError = require("../utils/appError");

exports.getProducts = getAll(Product);
exports.getProductById = getOne(Product);
exports.addProduct = createOne(Product);
exports.updateProduct = updateOne(Product);
exports.deleteProduct = deleteOne(Product);

exports.searchSuggestions = catchAsync(async (req, res, next) => {
    // console.log('asdasdsa');
    const query = req.body.term;
    try {
        let result = await Product.aggregate([
            {
                $search: {
                    index: "default",
                    autocomplete: {
                        query,
                        path: "name",
                        fuzzy: {
                            maxEdits: 2,
                            prefixLength: 3,
                        },
                    },
                },
            },
            {
                $project: {
                    name: 1,
                    _id:0
                },
            },
        ]);
        let resArray = result.map(obj=>obj.name);
        res.status(200).json({
            status: "success",
            body: {
                resArray,
            },
        });
    } catch (e) {
        next(new AppError(`${e}`, 500));
    }
});
