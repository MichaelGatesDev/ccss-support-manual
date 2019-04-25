"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = require("express");
var App_1 = __importDefault(require("../../../../App"));
var router = express_1.Router();
router.param('buildingID', function (req, res, next, id) {
    for (var _i = 0, _a = App_1.default.getDataManager().getBuildingManager().getBuildings(); _i < _a.length; _i++) {
        var building = _a[_i];
        if (building.getInternalName() == id) {
            req.building = building;
            next();
            return;
        }
    }
    next(new Error('Failed to find building: ' + id));
});
var all = require('./all');
router.use('/', all);
var single = require('./single');
router.use('/:buildingID', single);
module.exports = router;
