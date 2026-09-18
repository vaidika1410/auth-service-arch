const express = require('express')
const app = express()
const userRoutes = require('./routes/user.route')
const jwt = require('jsonwebtoken')
require('dotenv').config({
    path: '../.env'
})


const port = 5002
app.use(express.json())
app.get('/', (req, res) => {
    return res.json({
        message: `user service running on ${port}`
    })
})

app.use((req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(400).json({ message: 'auth header must be provided' })
    }

    let token = authHeader.split(' ')[1]


    if (req.path == '/auth/register-user' || req.path == '/auth/login') {
        console.log('login and register')
        return next()
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

            if(decode.role !== 'user') {
                return res.status(400).json({ message: "invalid token" })
            }

            if (new Date().toTimeString() > token.expiresAt) {
                return res.status(400).json({ message: "token has expired" })
            }

            // req.user = decode

            next()


        } catch (error) {
            throw error
        }
    }

})

app.use('/auth', userRoutes)

app.listen(port, () => {
    console.log(`user services running on ${port}`)
})