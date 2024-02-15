const express = require('express');
const router = express.Router();
const basicQueryController = require('../controllers/basic-query-controller');

router.get('/', basicQueryController.getBasicQuery);
router.post('/query', basicQueryController.executeBasicQuery);

module.exports = router;
