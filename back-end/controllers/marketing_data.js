const db = require('../model/db');

const getAllMarketingDataPoints = async (req, res) => {
    try {
        const { data, error } = await db.from('marketing_data_points').select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching marketing data points:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getAllMarketingDataPoints,
};