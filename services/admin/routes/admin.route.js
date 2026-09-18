const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
require('dotenv').config({
    path: '../.env'
})

const adminLoginController = require('../controllers/login.controller')
const getUsersController = require('../controllers/getUsers.controller')
const updateUserStatusController = require('../controllers/updateUserStatus.controller')

const adminLogin = async (req, res) => {
    try {
        const admin = await adminLoginController.adminLogin(req.body)
        let generatedToken = jwt.sign({ email: admin.email, role: admin.role }, process.env.SECRET_KEY, { expiresIn: '60m' })
        return res.status(200).json({
            message: "admin logged in successfully", generatedToken, admin
        })
    } catch (error) {
        console.error(error.message)
        return res.status(400).json({
            error: error
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await getUsersController.getUsers()
        return res.status(200).json({
            message: "users fetched successfully",
            users: users
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message,
        })
    }
}

const updateUserStatus = async (req, res) => {
    try {
        const id = req.params.id

        if(!id) {
            return res.status(400).json({
                message: "user-id is required"
            })
        }

        const user = await updateUserStatusController.updateStatus(id)

        return res.status(200).json({
            message: "user status updated successfully"
        })
        
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
}

router.post('/admin-login', adminLogin)
router.get('/users', getAllUsers)
router.patch('/update/:id', updateUserStatus)

module.exports = router