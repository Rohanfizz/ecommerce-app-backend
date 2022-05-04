const express = require('express');

const messageRouter = express.Router();

messageRouter.post('/',postMessage);