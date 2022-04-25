const { catchAsync } = require("../utils/catchAsync");

exports.cartUpdate =catchAsync(async (req,res,next)=>{
    let userUUID = req.user.id;
    console.log(userUUID);
    res.status(200).json({ status: "success" });
})