const fs = require('fs/promises')
const express = require('express')
const app = express()

app.use(express.json())

const port = 3002
app.get('/', (req, res) => {
    return res.json({
        message: `server running on ${port}`
    })
})

app.get('/verify', async (req, res) => {
    try{
        const token = req.query.token

        const tokens = JSON.parse(await fs.readFile('../services/data/verificationTokens.json', 'utf-8'))
        // console.log(tokens)
        const t = tokens.find(t => t.token === token)
        console.log(t)

        if(new Date().toTimeString() > t.expiresAt) {
            console.log('token has expired')
            throw "token has expired"
        } 

        const data = JSON.parse(await fs.readFile('../services/data/data.json', 'utf-8'))
        const users = data[0].users

        console.log(users)

        const check = users.find(user => user.email === t.email)
        console.log('check', check)
        check.status = 'verified'
        console.log(check.status)

        await fs.writeFile('../services/data/data.json', JSON.stringify(data), 'utf-8')

        console.log(token)
        return res.json({
            // message: "verification link works", token
            message: "user verified successfully. You can safely close this tab."
        })
    } catch(error) {
        return res.status(400).json({
            error: error
        })
    }

})

app.listen(port, () => {
    console.log(`server running on ${port}`)
})