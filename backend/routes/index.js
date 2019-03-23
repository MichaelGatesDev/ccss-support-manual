var express = require('express');
var router = express.Router();

const api = require('./api');
router.use('/api', api);

// router.get('/', function (req, res, next) {
//   res.send("This is the index page");
// });

module.exports = router;