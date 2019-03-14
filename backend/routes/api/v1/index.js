var express = require('express');
var router = express.Router();


const buildings = require('./buildings');
router.use('/buildings/', buildings);


router.get('/', function(req, res, next) {
  res.send("This is the primary API v1 route");
});


module.exports = router;
