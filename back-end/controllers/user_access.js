const db = require('../model/db');


// POST create a new user access row
exports.createAccess = async (req, res) => {
    const { user_id, marketing = 0, hr = 0, finance = 0, support = 0, operations = 0 } = req.body;
  
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
  
    try {
      const { data, error } = await db.from('user_access').insert([
        { user_id, marketing, hr, finance, support, operations }
      ]);

      if (error) {
        if (error.code === '23505') { // PostgreSQL unique violation error code
          return res.status(409).json({ error: 'User already exists' });
        }
        throw error;
      }

      res.status(201).json({ success: true, user_id });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create user access', detail: err.message });
    }
  };
  
// GET user access by ID
exports.getAccess = async (req, res) => {
  const { user_id } = req.params;
  try {
    const { data, error } = await db.from('user_access').select('*').eq('user_id', user_id);

    if (error) throw error;

    if (data.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
};

// PUT update user access
exports.updateAccess = async (req, res) => {
  const { user_id } = req.params;
  const { marketing, hr, finance, support, operations } = req.body;

  try {
    const { data, error } = await db.from('user_access')
      .update({ marketing, hr, finance, support, operations })
      .eq('user_id', user_id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Update failed', detail: err.message });
  }
};

// GET check if user has access to one department
exports.checkDepartmentAccess = async (req, res) => {
  const { user_id, department } = req.params;

  const allowed = ['marketing', 'hr', 'finance', 'support', 'operations'];
  if (!allowed.includes(department)) {
    return res.status(400).json({ error: 'Invalid department' });
  }

  try {
    const { data, error } = await db.from('user_access').select(department).eq('user_id', user_id);

    if (error) throw error;

    if (!data.length) return res.status(404).json({ error: 'User not found' });

    res.json({ access: data[0][department] === 1 });
  } catch (err) {
    res.status(500).json({ error: 'Check failed', detail: err.message });
  }
};

exports.getAll = async (req,res) =>{
    try {
        const { data, error } = await db.from('user_access').select('*');
    
        if (error) throw error;

        if (!data.length) return res.status(404).json({ error: 'No users found' });
    
        res.json({ access: data });
      } catch (err) {
        res.status(500).json({ error: 'Check failed', detail: err.message });
      }
}