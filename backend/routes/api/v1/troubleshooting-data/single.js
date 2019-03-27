const express = require('express');
const router = express.Router({
    mergeParams: true
});

var dataHelper = require('../../../../data-helper');

router.get('/', (req, res, next) => {
    res.json(req.troubleshootingData);
});

module.exports = router;