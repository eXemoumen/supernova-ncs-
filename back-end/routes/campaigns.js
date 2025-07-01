const express = require('express');
const router = express.Router();
const { getAllCampaigns, getCampaignById, addCampaign } = require('../controllers/campaigns');

router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.post('/', addCampaign);

module.exports = router;
