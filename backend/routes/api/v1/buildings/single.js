"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = require("express");
var router = express_1.Router();
router.get('/', function (req, res, next) {
    res.json(req.building);
});
var rooms_1 = __importDefault(require("./rooms"));
router.use('/rooms', rooms_1.default);
module.exports = router;
