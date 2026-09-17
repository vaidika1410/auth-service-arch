const express = require('express')
const app = express()
const { createProxyMiddleware } = require('http-proxy-middleware')

const port = 4000
var urlArray = ['http://localhost:5000','http://localhost:5001','http://localhost:5002'];

// for (let i = 0; i < urlArray.length; i++) {
 
//     app.use('/api', createProxyMiddleware({
//         target:  urlArray[i],
//         changeOrigin: true
//     }))
// }

// app.use('/admin', createProxyMiddleware({
//     target: ,
//     changeOrigin: true
// }))

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