const Message = require("../models/messageModel");
const { createOne } = require("./handleFactory");

exports.postMessage = createOne(Message);

