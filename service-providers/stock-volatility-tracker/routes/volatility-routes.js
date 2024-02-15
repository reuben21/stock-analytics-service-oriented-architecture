const express = require('express');
const router = express.Router();
const volatilityQueryController = require('../controllers/volatility-controller');

router.post('/query', volatilityQueryController.executeVolatilityQuery);

module.exports = router;
