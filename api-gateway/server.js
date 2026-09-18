const express = require('express')
const app = express()
const { createProxyMiddleware } = require('http-proxy-middleware')

const port = 4000

app.use('/user', createProxyMiddleware({
    target: 'http://localhost:5002',
    changeOrigin: true
}))

app.use('/admin', createProxyMiddleware({
    target: 'http://localhost:5001',
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