const fs = require("fs");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const Product = require("../models/productModel");

dotenv.config({ path: "../config.env" });

const DB = process.env.DATABASE_DEV.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        // useNewUrlparser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
    })
    .then((con) => {
        // console.log(con.connections);
        console.log("DB CONNECTION SUCCESSFUL💞");
    });

const products = JSON.parse(
    fs.readFileSync(`${__dirname}/products.json`, "utf-8")
);

const importData = async () => {
    try {
        await Product.create(products);
        console.log("Data Loaded Successfully✨");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await Product.deleteMany();
        await Product.collection.dropIndex('uuid_1');
        console.log("Data Deleted Successfully🗑️");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === "--import") {
    importData();
} else deleteData();

console.log(process.argv);
