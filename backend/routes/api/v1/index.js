"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = require("express");
var router = express_1.Router();
var buildings_1 = __importDefault(require("./buildings"));
router.use('/buildings/', buildings_1.default);
var rooms_1 = __importDefault(require("./rooms"));
router.use('/rooms/', rooms_1.default);
var images_1 = __importDefault(require("./images"));
router.use('/images/', images_1.default);
var troubleshooting_data_1 = __importDefault(require("./troubleshooting-data"));
router.use('/troubleshooting-data/', troubleshooting_data_1.default);
router.get('/', function (req, res, next) {
    res.send("This is the primary API v1 route");
});
module.exports = router;
