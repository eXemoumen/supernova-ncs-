const db = require('../model/db');

const getRevenueData = async (req, res) => {
    try {
        const { data, error } = await db.from('revenue_data').select('*');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Error fetching revenue data:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getDepartmentPerformance = async (req, res) => {
    try {
        const { data, error } = await db.from('department_performance').select('*');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Error fetching department performance data:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAiInsights = async (req, res) => {
    try {
        const { data, error } = await db.from('ai_insights').select('*');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Error fetching AI insights:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getKpiMetrics = async (req, res) => {
    try {
        const { data, error } = await db.from('kpi_metrics').select('*');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Error fetching KPI metrics:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
  
  module.exports = {
    getRevenueData,
    getDepartmentPerformance,
    getAiInsights,
    getKpiMetrics,
  };