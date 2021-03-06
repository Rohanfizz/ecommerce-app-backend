const express = require("express");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const bodyParser = require('body-parser');
const cors = require('cors');
const cartRouter = require("./routes/cartRoutes");
const productRouter = require("./routes/productRoutes");
const orderRouter = require("./routes/orderRoutes");
const compression = require('compression');
const messageRouter = require("./routes/messageRoutes");

const app = express();
app.use(cors());
const jsonParser = bodyParser.json()

// Routes
// app.use('/api/v1/products',productRouter);
app.use(jsonParser);
app.use(compression());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/cart",cartRouter);
app.use("/api/v1/products",productRouter);
app.use("/api/v1/orders",orderRouter);
app.use("/api/v1/message",messageRouter);


app.all("*", (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
