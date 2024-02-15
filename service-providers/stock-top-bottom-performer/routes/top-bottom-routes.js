const express = require('express');
const router = express.Router();
const topBottomQueryController = require('../controllers/top-bottom-controller');

router.post('/query', topBottomQueryController.executeTopBottomQuery);

module.exports = router;