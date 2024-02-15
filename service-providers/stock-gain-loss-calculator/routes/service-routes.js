const express = require('express');
const router = express.Router();
const gainLossQueryRoutes = require('./gain-loss-routes');
const gainLossQueryService = require('../services/gain-loss-calculator/gain-loss-service');

const gainLossQueryRoute = '/' + gainLossQueryService.SERVICE_NAME;
router.use(gainLossQueryRoute, gainLossQueryRoutes);

module.exports = router;
