const fs = require('fs/promises')
const bcrypt = require('bcrypt')

const path = '../data/data.json'
const adminLogin = async (params) => {
    try{
        const {email, password} = params

        if(!email) {
            throw "email is required"
        }
        
        if(!password) {
            throw "password is required"
        }
        
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!regex.test(email)) {
            throw "invalid email"
        }

        let status = 'inactive'
        const data = JSON.parse(await fs.readFile(path, 'utf-8'))
        const admins = data[0].admins

        // console.log(admins)
        const admin = admins.find(a => a.email === email)

        // console.log(admin)

        if(!admin) {
            throw 'admin does not exist'
        }

        admin.status = 'active'

        await fs.writeFile(path, JSON.stringify(data), 'utf-8')

        return admin

    } catch(error) {
        throw error
    }
}

module.exports = {adminLogin}