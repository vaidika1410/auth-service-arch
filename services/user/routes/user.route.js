const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userController = require('../controllers/user.controller')
const multer = require('multer')

const upload = multer({dest: 'uploads'})

router.post('/register-user', registerUser)
router.post('/login', loginUser)
router.get('/authenticate', authenticate)
router.post('/update-user', update)

// router.post('/upload', userController.upload.single('image'), userController.uploadImage)
router.post('/upload', upload.single('file'), (req, res) => {
    if(!req.file) {
        console.log('file not received')
        return res.send({
            success: false
        })
    } else {
        console.log('file received')
        return res.send({
            success: true
        })
    }
})


// router.use(express.static(__dirname, 'public'))


async function registerUser(req, res) {
    try{
        const user = await userController.registerUser(req.body)
        return res.status(200).json({
            message: "user registered successfully",
            user: user
        })
    } catch(error) {
        return res.status(400).json({
            error: error
        })
    }
}

async function loginUser(req, res) {
    try{
        let generatedToken = jwt.sign({ data: 'Token data' }, process.env.SECRET_KEY, { expiresIn: '60m' })
        const user = await userController.login(req.body)
        return res.status(200).json({
            message: "user logged in successfully", generatedToken
        })
    } catch(error) {
        return res.status(400).json({
            error: error
        })
    }
}

async function authenticate(req, res) {
    try{
        let generatedToken = jwt.sign({ data: 'Token data' }, process.env.SECRET_KEY, { expiresIn: '60m' })
        return res.status(200).json({
            message: "here is your authentication token", 
            token: generatedToken
        })
    } catch(error) {
        return res.status(400).json({
            error: error
        })
    }
}

async function update(req, res) {
    try{

        var authHeader = req.headers.authorization;
        // if(!authHeader) {
        //     throw "auth header must be provided"
        // }
        // // console.log(authHeader)
        // if(authHeader) {
            var token = authHeader.split(' ')[1]
        //     if(!token) {
        //         throw "token must be provided"
        //     }
        // }

        console.log(token,"tokennnnnnnnnnnnnnnnnnnnn")


        jwt.verify(token, process.env.SECRET_KEY, function(error, decoded) {
            if(error) {
                throw error
            } else {
                return decoded
            }
        })

        const user = await userController.updateProfile(req.body, token)
        return res.status(200).json({
            message: "user updated successfully", user
        })
    } catch(error) {
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