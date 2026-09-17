const express = require('express')
const app = express()
const { createProxyMiddleware } = require('http-proxy-middleware')

const port = 4000

app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true
}))

app.get('/', (req, res) => {
    return res.json({
        message: `api gateway server running on ${port}`
    })
})

app.listen(port, () => {
    console.log(`api gateway server running on ${port}`)
})