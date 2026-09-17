const fs = require('fs/promises')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv').config({
    path: '../.env'
})
const crypto = require('crypto')
const multer = require('multer')
const {nanoid} = require('nanoid')


const path = '../data/data.json'
async function registerUser(params) {
    try {
        // const users = JSON.parse(await fs.readFile('./data/users.json', 'utf-8'))
        const data = JSON.parse(await fs.readFile(path, 'utf-8'))

        const users = data[0].users

        console.log(users)

        console.log("register user api hit")

        const { email, password } = params

        if (!email) {
            throw "email is required"
        }

        if (!password) {
            throw "password is required"
        }

        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(email)) {
            throw "incorrect email format, use correct email"
        }


        const existingUser = users.find(user => user.email === email)
        console.log(existingUser)

        if (existingUser) {
            throw "user exist already, please use a different email"
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        let status = 'unverified'

        const id = nanoid();
        console.log(`Nano ID: ${id}`);

        const user = {
            userId: id,
            email: email,
            password: hashedPassword,
            status: status,
            date: new Date().toDateString(),
            loginStatus: 'inactive'
        }

        console.log(user)

        users.push(user)

        console.log(users)

        await sendEmail(user.email)

        await fs.writeFile(path, JSON.stringify(data), 'utf-8')


    } catch (error) {
        throw error
    }
}

async function login(params) {
    try {
        console.log('login api hit')

        const data = JSON.parse(await fs.readFile(path, 'utf-8'))
        // const loggedusers = JSON.parse(await fs.readFile('./data/loggedUsers.json', 'utf-8'))
        // console.log(users)

        const users = data[0].users
        console.log(users)

        const { email, password } = params

        if (!email) {
            throw "email is required"
        }

        if (!password) {
            throw "password is required"
        }

        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(email)) {
            throw "invalid email. please use a valid email"
        }

        let existing = users.find(user => user.email === email)
        if (!existing) {
            console.log('existing ', existing)
            throw "user isn't registered"
        }

        const compare = await bcrypt.compare(password, existing.password)
        console.log("passwords match", compare)

        // if (compare) {
        //     const info = await transporter.sendMail({
        //         from: process.env.EMAIL_USER,
        //         to: existing.email,
        //         subject: "Email verification",
        //         text: `Please click on the below link to get your verification token
        //         http://localhost:4000/api/user/authenticate`
        //     })
        // }

        existing.loginStatus = 'active'

        // let id = loggedusers.length + 1

        // const obj = {
        //     id: id,
        //     email: user.email,
        //     password: user.password,
        //     status: user.status,
        //     date: new Date().toDateString()
        // }

        // users.push(obj)

        // console.log(user)

        await fs.writeFile(path, JSON.stringify(data), 'utf-8')

    } catch (error) {
        throw error
    }
}

async function updateProfile(params) {
    try {
        const data = JSON.parse(await fs.readFile(path, 'utf-8'))
        // const userProfiles = JSON.parse(await fs.readFile('./data/userProfile.json', 'utf-8'))

        const users = data[0].users

        const { email, name, phone } = params

        const user = users.find(user => user.email === email)
        // console.log(user)

        if (user.loginStatus === 'inactive') {
            throw "user is logged out. please login first"
        }

        if (user.status !== 'verified') {
            throw "user is not verified"
        }

        if (!email) {
            throw "email is missing"
        }

        if (!name) {
            throw "name is missing"
        }

        if (!phone) {
            throw "phone number is missing"
        }

        if (phone.length < 10) {
            throw "phone number must contain 10 digits"
        }

        const profile = {
            name: name,
            phone: phone,
            update_date: new Date().toDateString()
        }

        user.details = profile
        console.log(user)

        await fs.writeFile(path, JSON.stringify(data), 'utf-8')


    } catch (error) {
        throw error
    }
}

const upload = multer({
    dest: '../uploads'
})


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, '../uploads/')
    },
    filename: (req, file, callback) => {
        callback(file.fieldname)
    }
})

// console.log(upload)

async function uploadImage(req, res) {
    try {
        console.log('upload image api hit')
        console.log(req.file)
        res.json({
            message: "image uploaded",
            file: req.file
        })

    } catch (error) {
        throw error
    }
}

const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.log(error.message)
    } else {
        console.log("transporter working")
    }
})

async function sendEmail(email) {
    try {

        console.log("send mail function is called")
        const token = crypto.randomBytes(32).toString('hex')

        const tokens = JSON.parse(await fs.readFile('../data/verificationTokens.json', 'utf-8'))

        console.log(token)

        const t = {
            email: email,
            token: token,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toTimeString()
        }

        tokens.push(t)

        // console.log(tokens)

        console.log('before sendMail')
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Email verification",
            text: `please follow the link to verify your email
            http://localhost:3002/verify?token=${token}`
        })
        console.log('After sendMail')

        await fs.writeFile('../data/verificationTokens.json', JSON.stringify(tokens), 'utf-8')
        // console.log(info)

    } catch (error) {
        console.error(error.message)
        throw error
    }
}


module.exports = { registerUser, login, updateProfile, uploadImage }