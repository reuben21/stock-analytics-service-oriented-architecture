const express = require('express');
const router = express.Router();
const searchEngineController = require('../controllers/searchEngineController');

router.get('/', searchEngineController.renderSearchEngine);

module.exports = router;
