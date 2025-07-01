const express = require('express');
const router = express.Router();
const { getAllContentIdeas, getContentIdeaById, addContentIdea } = require('../controllers/content_ideas');

router.get('/', getAllContentIdeas);
router.get('/:id', getContentIdeaById);
router.post('/', addContentIdea);

module.exports = router;
