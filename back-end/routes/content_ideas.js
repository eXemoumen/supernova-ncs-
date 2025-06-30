const express = require('express');
const router = express.Router();
const contentIdeasController = require('../controllers/content_ideas');

router.get('/', contentIdeasController.getAllContentIdeas);

module.exports = router;