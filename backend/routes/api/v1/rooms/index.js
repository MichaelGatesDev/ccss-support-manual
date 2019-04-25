"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = require("express");
var App_1 = __importDefault(require("../../../../App"));
var router = express_1.Router();
var all = require('./all');
router.use('/', all);
router.param('roomID', function (req, res, next, id) {
    var room = App_1.default.getDataManager().getRoomManager().getRoomByID(id);
    if (room) {
        req.room = room;
        next();
        return;
    }
    next(new Error('Failed to find room: ' + id));
});
var single = require('./single');
router.use('/:roomID', single);
module.exports = router;
