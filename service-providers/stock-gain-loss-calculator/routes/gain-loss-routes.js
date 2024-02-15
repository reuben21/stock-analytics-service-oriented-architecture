const express = require('express');
const router = express.Router();
const gainLossQueryController = require('../controllers/gain-loss-controller');

router.post('/query', gainLossQueryController.executeGainLossQuery);

module.exports = router;
