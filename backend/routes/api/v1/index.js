"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = require("express");
var App_1 = require("../../../App");
var router = express_1.Router();
var buildings_1 = __importDefault(require("./buildings"));
router.use('/buildings/', buildings_1.default);
var buildings_2 = __importDefault(require("./buildings"));
router.use('/rooms/', buildings_2.default);
var images_1 = __importDefault(require("./images"));
router.use('/images/', images_1.default);
var troubleshooting_data_1 = __importDefault(require("./troubleshooting-data"));
router.use('/troubleshooting-data/', troubleshooting_data_1.default);
router.get('/', function (req, res, next) {
    res.send("This is the primary API v1 route");
});
router.get('/getbuilding', function (req, res, next) {
    if (!req.query.roomID) {
        res.send("You must specify a room ID");
        return;
    }
    res.json(App_1.app.getDataManager().getRoomManager().getRoomByID(req.query.roomID));
});
module.exports = router;
