const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');

router.get('/revenue', dashboardController.getRevenueData);
router.get('/department-performance', dashboardController.getDepartmentPerformance);
router.get('/ai-insights', dashboardController.getAiInsights);
router.get('/kpi-metrics', dashboardController.getKpiMetrics);

module.exports = router;