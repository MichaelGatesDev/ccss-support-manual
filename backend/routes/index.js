var express = require('express');
var router = express.Router();

router.use('/buildings', require('./buildings'));
router.use('/error', require('./error'));
// router.use('/search', require('./search'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Hello world");
});

module.exports = router;
