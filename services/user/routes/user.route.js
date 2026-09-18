const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()


const userController = require('../controllers/user.controller')
const multer = require('multer')

const upload = multer({ dest: 'uploads' })

// http.createServer(function(req, res){
//     res.write(200, {'content-type': 'text/html'})

//     let url = req.url

//     if(url === '/update-user') {

//     }

// }).listen(port, () => {
//     console.log(`services server running on ${port}`)
// })

router.post('/register-user', registerUser)
router.post('/login', loginUser)
// router.get('/authenticate', authenticate)
router.post('/update-user', update)

// router.post('/upload', userController.upload.single('image'), userController.uploadImage)
router.post('/upload', upload.single('file'), (req, res) => {
    try {
        let mimeTypes = ['image/jpg', 'image/png', 'image/jpeg']

        if (!req.file) {
            console.log('file not received')
            return res.send({
                success: false,
                message: "file is required"
            })
        } else {
            console.log('file received')
            if (!mimeTypes.includes(req.file.mimetype)) {
                return res.status(400).json({
                    error: 'invalid upload type'
                })
            }
            return res.send({
                success: true
            })
        }
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
})


// router.use(express.static(__dirname, 'public'))


async function registerUser(req, res) {
    try {
        const user = await userController.registerUser(req.body)
        return res.status(200).json({
            message: "user registered successfully",
            user: user
        })
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
}

async function loginUser(req, res) {
    try {
        const user = await userController.login(req.body)
        let generatedToken = jwt.sign({ email: user.email, role: "user" }, process.env.SECRET_KEY, { expiresIn: '60m' })

        // console.log(user.email)
        return res.status(200).json({
            message: "user logged in successfully", generatedToken, user
        })
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
}

// async function authenticate(req, res) {
//     try{
//         let generatedToken = jwt.sign({ data: 'Token data' }, process.env.SECRET_KEY, { expiresIn: '60m' })
//         return res.status(200).json({
//             message: "here is your authentication token", 
//             token: generatedToken
//         })
//     } catch(error) {
//         return res.status(400).json({
//             error: error
//         })
//     }
// }

async function update(req, res) {
    try {

        const user = await userController.updateProfile(req.body)
        return res.status(200).json({
            message: "user updated successfully", user
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

// async function uploadImage(req, res) {
//     try{
//         const u = userController.uploadImage(req.body)
//         u.single('image')
//         return res.status(200).json({
//             message: 'image upload', upload: u
//         })
//     } catch(error) {
//         return res.status(400).json({
//             error: error
//         })
//     }
// }

module.exports = router