const express = require('express');
const router = express.Router();
const suspiciousTradesQueryRoutes = require('./suspicious-trades-route');
const suspiciousTradesQueryService = require('../services/suspicious-trades-services/suspicious-trades-service');

const suspiciousTradesQueryRoute = '/' + suspiciousTradesQueryService.SERVICE_NAME;
router.use(suspiciousTradesQueryRoute, suspiciousTradesQueryRoutes);

module.exports = router;
