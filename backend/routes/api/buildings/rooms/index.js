const express = require('express');
const router = express.Router({
    mergeParams: true
});
const path = require('path');

const all = require('./all');
const single = require('./single');


router.param('room', function (req, res, next, id) {
    // get room by building param and id
});


router.get('/:room', single);
router.get('/', all);

module.exports = router;