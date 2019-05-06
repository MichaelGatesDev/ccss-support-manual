"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = require("express");
var v1_1 = __importDefault(require("./v1"));
var router = express_1.Router();
router.use('/v1', v1_1.default);
router.get('/', function (req, res, next) {
    res.send("This is the primary API route");
});
module.exports = router;
