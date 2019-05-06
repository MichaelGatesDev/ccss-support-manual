"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = require("express");
var api_1 = __importDefault(require("./api"));
var router = express_1.Router();
router.use('/api', api_1.default);
module.exports = router;
