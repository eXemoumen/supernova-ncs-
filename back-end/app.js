require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./model/db');
const authRoutes = require('./routes/auth')
const accessRoutes = require('./routes/user_access')
const dashboardRoutes = require('./routes/dashboard')
const agentRoutes = require('./routes/agent')
const clientRoutes = require('./routes/clients')
const campaignsRoutes = require('./routes/campaigns')
const contentIdeasRoutes = require('./routes/content_ideas')
const marketingDataRoutes = require('./routes/marketing_data')
// const departmentRoutes = require('./routes/departments')
// const exportRoutes = require('./routes/export')
// const errorHandler = require('./middleware/errorHandler')


app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/access', accessRoutes)
app.use('/api/dashboard', dashboardRoutes)
// app.use('/api/departments', departmentRoutes)
app.use('/api/agent', agentRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/campaigns', campaignsRoutes)
app.use('/api/content-ideas', contentIdeasRoutes)
app.use('/api/marketing-data', marketingDataRoutes)
// app.use('/api/export', exportRoutes)
app.use('/test',(req,res)=>{
    res.send('hey')
})
// Middleware global
// app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API running on ${PORT}`))
async function testDBConnection() {
    try {
      const { data, error } = await db.from('user_access').select('user_id').limit(1);
      if (error) throw error;
      console.log('✅ Supabase database connected!');
    } catch (err) {
      console.error('❌ Failed to connect to Supabase:', err.message);
      process.exit(1); // stop the app if DB fails
    }
  }
  
  testDBConnection();
