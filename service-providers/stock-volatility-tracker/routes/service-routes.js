const express = require('express');
const router = express.Router();
const volatilityQueryRoutes = require('./volatility-routes');
const volatilityQueryService = require('../services/volatility-tracker/volatility-service');

const volatilityQueryRoute = '/' + volatilityQueryService.SERVICE_NAME;
router.use(volatilityQueryRoute, volatilityQueryRoutes);

module.exports = router;
