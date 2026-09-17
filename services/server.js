const express = require('express')
const app = express()
const userRoutes = require('../services/user/routes/user.route')
const adminRoutes = require('../services/admin/routes/admin.route')


const port = 5000

app.use(express.json())
app.get('/', (req, res) => {
    return res.json({
        message: `services server running on ${port}`
    })
})

app.use('/user', userRoutes)
app.use('/admin', adminRoutes)

app.listen(port, () => {
    console.log(`services server running on ${port}`)
})