const { default: axios } = require("axios");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const { catchAsync } = require("../utils/catchAsync");
const fs = require("fs");
const https = require("https");

function generateInvoice(invoice, filename, success, error) {
    var postData = JSON.stringify(invoice);
    var options = {
        hostname: "invoice-generator.com",
        port: 443,
        path: "/",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData),
        },
    };

    var file = fs.createWriteStream(filename);

    var req = https.request(options, function (res) {
        res.on("data", function (chunk) {
            file.write(chunk);
        }).on("end", function () {
            file.end();

            if (typeof success === "function") {
                success(file);
            }
        });
    });
    req.write(postData);
    req.end();

    if (typeof error === "function") {
        req.on("error", error);
    }
}

exports.placeOrder = catchAsync(async (req, res, next) => {
    const order = req.body;
    //check the availability of products
    const cart = order.cart;

    const allProductsInCart = await Promise.all(
        cart.products.map((ele) => {
            return Product.findById(ele.product).select({ name: 1, stock: 1 });
        })
    );

    let outOfStockItems = [];
    cart.products.forEach((ele, idx) => {
        if (ele.quantity > allProductsInCart[idx].stock) {
            outOfStockItems.push(allProductsInCart[idx]);
        }
    });

    // if not available, send error response
    if (outOfStockItems.length > 0) {
        res.status(400).json({
            status: "failure",
            data: {
                outOfStockItems,
            },
        });
        next();
    }
    // if available create new order document

    const newOrder = await Order.create({ ...order, userId: req.user._id });

    // subtract from stock
    await Promise.all(
        cart.products.map((ele) => {
            return Product.findByIdAndUpdate(ele.product, {
                $inc: { stock: outOfStockItems.length ? 0 : -ele.quantity },
            });
        })
    );

    res.status(202).json({
        status: "success",
        data: { _id: newOrder._id },
    });
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ userId: req.user._id }).select({_id:1,orderStatus:1,createdAt:1,totalPrice:1,invoice:1});
    res.status(200).json({
        status: "success",
        data: {
            orders:{
                inProgress: orders.filter((order)=> order.orderStatus!='Delivered' && order.orderStatus!='Cancelled'),
                completed: orders.filter((order)=> order.orderStatus==='Delivered' || order.orderStatus==='Cancelled')
            }
        },
    });
});

exports.invoiceGenerator = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId).populate({
        path: "cart",
        populate: {
            path: "products",
            populate: {
                path: "product",
                select: {
                    price: 1,
                    name: 1,
                    tax: 1,
                },
            },
        },
    });
    console.log(order.delivery);
    const invoiceObject = {
        from: "LukGud",
        to: `${order.shipmentInfo.firstName} ${order.shipmentInfo.firstName}`,
        logo: "https://static.libnet.info/images/events/dekalb/Flower_Hunt.jpg",
        number: order.invoice,
        custom_fields: [
            {
                name: "Address",
                value: order.shipmentInfo.streetAddress,
            },
            {
                name: "City",
                value: order.shipmentInfo.city,
            },
            {
                name: "Zip Code",
                value: order.shipmentInfo.zipCode,
            },
        ],
        fields: {
            tax: true,
            discounts: false,
            shipping: true,
        },
        ship_to: order.shipmentInfo.streetAddress,
        tax: order.tax,
        shipping: order.delivery || "0",
        items: order.cart.products.map((ele) => {
            return {
                name: ele.product.name,
                quantity: ele.quantity,
                unit_cost: ele.product.price,
            };
        }),
        notes: "Thanks for your purchase!",
        currency: "inr",
    };

    await generateInvoice(
        invoiceObject,
        "Invoice.pdf",
        (file) => {
            res.status(200).sendFile("Invoice.pdf", { root: `__dirname/..` });
        },
        (err) => {
            next(new AppError("Unable to send pdf", 400));
        }
    );

    // const invoiceData = await axios
    //     .post("https://invoice-generator.com/", invoice, {
    //         responseType: "blob",
    //         reponseEncoding: 'binary',
    //         headers: {
    //             "Content-Type": "application/pdf",
    //             Accept: "application/pdf",
    //         },
    //     })
    //     .then((res) => res)

    // .catch((err) => {
    //     console.log(err.response);
    // });

    // console.log(invoiceData.data);
    // res.set('Content-Type', 'application/pdf');
    // res.set("Content-Length", Buffer.byteLength(invoice.data));
    // res.set("Accept-Encoding","gzip, deflate, br")
    // res.set("Content-Disposition",`attachment; filename="Invoice.pdf";`)
    // res.set("X-Frame-Options",`DENY`);
    // res.set("X-Content-Type-Options",`nosniff`);
    // res.status(200).send(invoiceData.data);
    //     console.log(invoice);
    // console.log(invoiceData.data)
    // res.download(invoice.data);

    // res.status(200).json({
    //     status: "success",
    //     // data: invoice.data
    // });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId).populate({
        path: "cart",
        populate: {
            path: "products",
            populate: {
                path: "product",
                select: {
                    price: 1,
                    name: 1,
                    tax: 1,
                },
            },
        },
    });
    res.status(200).json({
        status: "success",
        data: {
            order,
        },
    });
});
