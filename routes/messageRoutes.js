const express = require('express');
const { postMessage } = require('../controllers/messageController');

const messageRouter = express.Router();

messageRouter.post('/',postMessage);


module.exports = messageRouter;