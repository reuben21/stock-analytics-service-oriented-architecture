const express = require('express');
const router = express.Router();
const basicQueryRoutes = require('./basic-query-routes');
const basicQueryService = require('../services/basic-query/basic-query-service');

const basicQueryRoute = '/' + basicQueryService.SERVICE_NAME;
router.use(basicQueryRoute, basicQueryRoutes);

module.exports = router;
