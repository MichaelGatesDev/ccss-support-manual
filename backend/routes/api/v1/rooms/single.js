const express = require('express');
const router = express.Router({
    mergeParams: true
});

router.get('/', (req, res, next) => {
    res.json(req.room);
});

module.exports = router;