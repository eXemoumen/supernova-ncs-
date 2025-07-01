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

const getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await db.from('campaigns').select('*').eq('id', id).single();
        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching campaign:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const addCampaign = async (req, res) => {
    try {
        const { name, status, budget, startDate, endDate, targetAudience, channels, client, niche } = req.body;

        const { data, error } = await db
            .from('campaigns')
            .insert([
                {
                    name,
                    status,
                    budget,
                    startDate,
                    endDate,
                    targetAudience,
                    channels,
                    client,
                    niche,
                },
            ])
            .select();

        if (error) throw error;

        res.status(201).json({ message: "Campaign added successfully!", campaign: data[0] });
    } catch (error) {
        console.error("Error adding campaign:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getAllCampaigns,
    getCampaignById,
    addCampaign,
};
