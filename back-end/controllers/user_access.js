const db = require('../model/db');


// POST create a new user access row
exports.createAccess = async (req, res) => {
    const { user_id, marketing = 0, hr = 0, finance = 0, support = 0, operations = 0 } = req.body;
  
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
  
    try {
      await db.execute(
        `INSERT INTO user_access
          (user_id, marketing, hr, finance, support, operations)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, marketing, hr, finance, support, operations]
      );
      res.status(201).json({ success: true, user_id });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'User already exists' });
      }
      res.status(500).json({ error: 'Failed to create user access', detail: err.message });
    }
  };
  
// GET user access by ID
exports.getAccess = async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM user_access WHERE user_id = ?',
      [user_id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
};

// PUT update user access
exports.updateAccess = async (req, res) => {
  const { user_id } = req.params;
  const { marketing, hr, finance, support, operations } = req.body;

  try {
    await db.execute(
      `UPDATE user_access
       SET marketing = ?, hr = ?, finance = ?, support = ?, operations = ?
       WHERE user_id = ?`,
      [marketing, hr, finance, support, operations, user_id]
    );
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
    const [rows] = await db.execute(
      `SELECT ?? FROM user_access WHERE user_id = ?`,
      [department, user_id]
    );

    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    res.json({ access: rows[0][department] === 1 });
  } catch (err) {
    res.status(500).json({ error: 'Check failed', detail: err.message });
  }
};

exports.getAll = async (req,res) =>{
    try {
        const [rows] = await db.execute(
          `SELECT * FROM user_access`,
          [department, user_id]
        );
    
        if (!rows.length) return res.status(404).json({ error: 'User not found' });
    
        res.json({ access: rows[0][department] === 1 });
      } catch (err) {
        res.status(500).json({ error: 'Check failed', detail: err.message });
      }
}