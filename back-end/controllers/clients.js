const db = require('../model/db');

const getAllClients = async (req, res) => {
    try {
        const { data, error } = await db.from('clients').select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching clients:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const addClient = async (req, res) => {
    try {
        const { name, niche, contact_person, contact_email, notes, industry, satisfaction, tier } = req.body;

        const { data, error } = await db
            .from('clients')
            .insert([
                {
                    name,
                    niche,
                    contact_person,
                    contact_email,
                    notes,
                    industry,
                    satisfaction,
                    tier,
                },
            ])
            .select();

        if (error) throw error;

        res.status(201).json({ message: "Client added successfully!", client: data[0] });
    } catch (error) {
        console.error("Error adding client:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, niche, contact_person, contact_email, notes, industry, satisfaction, tier } = req.body;

        const { data, error } = await db
            .from('clients')
            .update({
                name,
                niche,
                contact_person,
                contact_email,
                notes,
                industry,
                satisfaction,
                tier,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Client not found" });
        }

        res.status(200).json({ message: "Client updated successfully!", client: data[0] });
    } catch (error) {
        console.error("Error updating client:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await db
            .from('clients')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(204).send(); // No Content
    } catch (error) {
        console.error("Error deleting client:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getAllClients,
    addClient,
    updateClient,
    deleteClient,
};