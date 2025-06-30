const db = require('../model/db');

const getAllContentIdeas = async (req, res) => {
    try {
        const { data, error } = await db.from('content_ideas').select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching content ideas:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getAllContentIdeas,
};