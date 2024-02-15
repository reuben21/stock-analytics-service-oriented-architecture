const express = require('express');
const router = express.Router();
const consumerAPIController = require('../controllers/consumerAPIController');

router.get('/services/query', consumerAPIController.queryAllServices);

router.get('/services/query/:serviceName', consumerAPIController.queryServicesByName);

module.exports = router;
