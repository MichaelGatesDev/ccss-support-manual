const express = require('express');
const router = express.Router({
    mergeParams: true
});
const path = require('path');

const all = require('./all');
const single = require('./single');
const rooms = require('./rooms');

router.param('building', function (req, res, next, id) {
    // get building by id
});

router.use('/:building/rooms', rooms);
router.get('/:building', single);
router.get('/', all);

router.use(express.static(path.join(__dirname, '../../public')));

module.exports = router;