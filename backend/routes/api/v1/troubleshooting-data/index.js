"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = require("express");
var App_1 = require("../../../../App");
var router = express_1.Router();
var all_1 = __importDefault(require("./all"));
router.use('/', all_1.default);
router.param('roomID', function (req, res, next, id) {
    var troubleshootingData = App_1.app.getDataManager().getTroubleshootingDataManager().getTroubleshootingDataForRoom(id);
    if (troubleshootingData) {
        req.troubleshootingData = troubleshootingData;
        next();
        return;
    }
    next(new Error('Failed to find room: ' + id));
});
var single = require('./single');
router.use('/:roomID', single);
module.exports = router;
