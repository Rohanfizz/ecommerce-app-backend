const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}:${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.keyValue.name;
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError(`Invalid Token, Please log in again`, 401);
const handleJWTExpiredError = () =>
    new AppError("Your token has been expired! Please log in again", 401);

const serErrDev = (err, res) => {
    // since dev mode, send everything as it is
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        // Operational error, trusted, error: send message to client
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        //Programming or unknown error: don't leak error details
    } else {
        //1) Log the error
        console.error("ERROR 💥", err);

        //2)Send generic message
        res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        serErrDev(err, res);
    } else {
        let error = { ...err };
        console.log("💥💥💥💥💥", err.name);
        if (err.name === "CastError") error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateFieldsDB(error);
        if (err.name === "ValidationError") error = handleValidationDB(error);
        if (error.name === "JsonWebTokenError") error = handleJWTError();
        if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};
