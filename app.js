const express = require("express");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
const jsonParser = bodyParser.json()

// Routes
// app.use('/api/v1/products',productRouter);
app.use("/api/v1/users",jsonParser, userRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
