const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./model/db');
const authRoutes = require('./routes/auth')
const accessRoutes = require('./routes/user_access')
// const agentRoutes = require('./routes/agent')
// const departmentRoutes = require('./routes/departments')
// const exportRoutes = require('./routes/export')
// const errorHandler = require('./middleware/errorHandler')


app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/access', accessRoutes)
// app.use('/api/departments', departmentRoutes)
// app.use('/api/agent', agentRoutes)
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
      const [rows] = await db.execute('SELECT 1');
      console.log('✅ MySQL database connected!');
    } catch (err) {
      console.error('❌ Failed to connect to MySQL:', err.message);
      process.exit(1); // stop the app if DB fails
    }
  }
  
  testDBConnection();
