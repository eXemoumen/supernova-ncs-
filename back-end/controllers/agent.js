const db = require('../model/db');

const run = async (req, res) => {
    try {
        const { department, module_type, priority, budget, target_audience, schedule, output_format, instructions } = req.body;

        const { data, error } = await db
            .from('runs')
            .insert([
                {
                    department,
                    module_type,
                    priority,
                    budget,
                    target_audience,
                    schedule,
                    output_format,
                    instructions,
                },
            ])
            .select();

        if (error) throw error;

        res.status(200).json({ message: "AI run initiated successfully!", run: data[0] });
    } catch (error) {
        console.error("Error initiating AI run:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    run,
};