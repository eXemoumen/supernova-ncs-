const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaigns');

router.get('/', campaignController.getAllCampaigns);

module.exports = router;