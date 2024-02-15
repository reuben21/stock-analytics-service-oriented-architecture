const express = require('express');
const router = express.Router();
const topBottomQueryRoutes = require('./top-bottom-routes');
const topBottomQueryService = require('../services/top-bottom-performer/top-bottom-service');

const topBottomQueryRoute = '/' + topBottomQueryService.SERVICE_NAME;
router.use(topBottomQueryRoute, topBottomQueryRoutes);

module.exports = router;