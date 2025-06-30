const express = require('express');
const router = express.Router();
const marketingDataController = require('../controllers/marketing_data');

router.get('/', marketingDataController.getAllMarketingDataPoints);

module.exports = router;