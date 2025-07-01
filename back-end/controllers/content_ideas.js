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

const getContentIdeaById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await db.from('content_ideas').select('*').eq('id', id).single();
        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: "Content idea not found" });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching content idea:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const addContentIdea = async (req, res) => {
    try {
        const { title, type, status, priority, client, niche } = req.body;

        const { data, error } = await db
            .from('content_ideas')
            .insert([
                {
                    title,
                    type,
                    status,
                    priority,
                    client,
                    niche,
                },
            ])
            .select();

        if (error) throw error;

        res.status(201).json({ message: "Content idea added successfully!", content_idea: data[0] });
    } catch (error) {
        console.error("Error adding content idea:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getAllContentIdeas,
    getContentIdeaById,
    addContentIdea,
};
