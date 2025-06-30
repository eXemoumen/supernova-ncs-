const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent');

router.post('/run', agentController.run);

module.exports = router;