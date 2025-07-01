const express = require('express');
const router = express.Router();
const { getMarketingData } = require('../controllers/marketing_data');

router.get('/', getMarketingData);

module.exports = router;
