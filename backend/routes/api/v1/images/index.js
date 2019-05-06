"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = require("express");
var App_1 = require("../../../../App");
var router = express_1.Router();
router.get("/", function (req, res) {
    res.json(App_1.app.getDataManager().getImageManager().getAllImages());
});
var buildings_1 = __importDefault(require("./buildings"));
router.use('/buildings', buildings_1.default);
module.exports = router;
