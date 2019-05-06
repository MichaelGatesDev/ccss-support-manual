"use strict";
var express_1 = require("express");
var router = express_1.Router();
router.get('/', function (req, res, next) {
    res.json(req.room);
});
module.exports = router;
