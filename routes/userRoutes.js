const express = require("express");
const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    protect,
    updatePassword,
    logout,
} = require("../controllers/authController");

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/forgotpassword", forgotPassword);

userRouter.patch("/resetpassword/:token", resetPassword);

userRouter.use(protect);
userRouter.patch("/updatePassword", updatePassword);
userRouter.get("/logout", logout);

module.exports = userRouter;
