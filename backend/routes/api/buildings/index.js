const express = require('express');
const router = express.Router({
    mergeParams: true
});

const all = require('./all');
const single = require('./single');
const rooms = require('./rooms');

router.get('/', all);
router.get('/:building', single);
router.use('/:building/rooms', rooms);

module.exports = router;