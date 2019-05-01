"use strict";
var express_1 = require("express");
var App_1 = require("../../../../App");
var router = express_1.Router();
router.get('/', function (req, res) {
    res.json(App_1.app.getDataManager().getTroubleshootingDataManager().getTroubleshootingData());
});
module.exports = router;
