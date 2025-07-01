const db = require('../model/db');

const getMarketingData = async (req, res) => {
    try {
        const { data, error } = await db.from('marketing_data').select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching marketing data:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getMarketingData,
};
