const express = require('express')
const router = express.Router()

const adminLoginController = require('../controllers/login.controller')
const getUsersController = require('../controllers/getUsers.controller')
const updateUserStatusController = require('../controllers/updateUserStatus.controller')

const adminLogin = async (req, res) => {
    try{
        const admin = await adminLoginController.adminLogin(req.body)
        return res.status(200).json({
            message: "admin logged in successfully", admin
        })
    } catch (error) {
        console.error(error.message)
        return res.status(400).json({
            error: error.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try{
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
    try{
        const id = req.params.id
        const user = updateUserStatusController.updateStatus(req.body, id)
        return res.status(200).json({
            message: "user status updated successfully"
        })
    } catch(error) {
        return res.status(400).json({
            error: error
        })
    }
}

router.post('/admin-login', adminLogin)
router.get('/users', getAllUsers)
router.patch('/update/:id', updateUserStatus)

module.exports = router