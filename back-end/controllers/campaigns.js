const db = require('../model/db');

const getAllCampaigns = async (req, res) => {
    try {
        const { data, error } = await db.from('campaigns').select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching campaigns:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getAllCampaigns,
};