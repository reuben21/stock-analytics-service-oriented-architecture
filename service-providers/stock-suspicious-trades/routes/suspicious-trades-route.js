const express = require('express');
const router = express.Router();
const suspiciousTradesQueryController = require('../controllers/suspicious-trades-controller');

router.post('/query', suspiciousTradesQueryController.executeSuspiciousTradesQuery);

module.exports = router;

