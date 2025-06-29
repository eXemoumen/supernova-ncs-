const express = require('express')
const app = express()
const cors = require('cors')
const authRoutes = require('./routes/auth')
// const agentRoutes = require('./routes/agent')
// const departmentRoutes = require('./routes/departments')
// const exportRoutes = require('./routes/export')
// const errorHandler = require('./middleware/errorHandler')


app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
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
