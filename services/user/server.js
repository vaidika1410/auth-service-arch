// const express = require('express')
// const app = express()
// const userRoutes = require('./routes/user.route')

// app.use(express.json())

// const port = 5002
// app.get('/', (req, res) => {
//     console.log('user server running')
//     return res.json({
//         message: "user server running..."
//     })
// })

// app.use('/auth', userRoutes)


// app.listen(port, () => {
//     console.log(`user services running on ${port}`)
// })

const express = require('express')
const app = express()
const userRoutes = require('./routes/user.route')
// const adminRoutes = require('../services/admin/routes/admin.route')


const port = 5002
app.use(express.json())
app.get('/', (req, res) => {
    return res.json({
        message: `user service running on ${port}`
    })
})

app.use('/auth', userRoutes)
// app.use('/admin', adminRoutes)

app.listen(port, () => {
    console.log(`user services running on ${port}`)
})