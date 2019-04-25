"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = require("express");
var App_1 = __importDefault(require("../../../../App"));
var router = express_1.Router();
router.get('/', function (req, res, next) {
    res.json(App_1.default.getDataManager().getBuildingManager().getBuildings);
});
module.exports = router;
