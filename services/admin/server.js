const express = require('express')
const app = express()
// const userRoutes = require('./routes/user.route')
const adminRoutes = require('./routes/admin.route')
const jwt = require('jsonwebtoken')
require('dotenv').config({
    path: '../.env'
})

const port = 5001
app.use(express.json())
app.get('/', (req, res) => {
    return res.json({
        message: `admin service running on ${port}`
    })
})

app.use((req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(400).json({ message: 'auth header must be provided' })
    }

    let token = authHeader.split(' ')[1]


    if (req.path == '/auth/admin-login' || req.path == '/auth/users') {
        return next()
        // console.log('login and register')
    } else {
        try {
            if (!token) {
                return res.status(400).json({ message: 'token is missing' })
            }

            const decode = jwt.verify(token, process.env.SECRET_KEY, function (error, decoded) {
                if (error) {
                    return res.status(400).json({ message: "something went wrong", error })
                } else {
                    return decoded
                }
            })

            if (new Date().toTimeString() > token.expiresAt) {
                return res.status(400).json({ message: "token has expired" })
            }

            req.user = decode

            next()


        } catch (error) {
            throw error
        }
    }

})

// app.use('/auth', userRoutes)
app.use('/auth', adminRoutes)

app.listen(port, () => {
    console.log(`admin service running on ${port}`)
})