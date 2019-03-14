var express = require('express');
var router = express.Router();

const api = require('./v1');
router.use('/v1', api);

router.get('/', function (req, res, next) {
  res.send("This is the primary API route");
});

module.exports = router;