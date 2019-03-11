var express = require('express');
var router = express.Router();

const buildings = require('./buildings');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("This is the primary API route");
});

router.use('/buildings/', buildings);


module.exports = router;
