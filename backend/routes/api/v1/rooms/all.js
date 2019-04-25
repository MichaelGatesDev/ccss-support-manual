"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = require("express");
var App_1 = __importDefault(require("../../../../App"));
var router = express_1.Router();
router.get('/', function (req, res) {
    res.json(App_1.default.getDataManager().getRoomManager().getRooms());
});
module.exports = router;
