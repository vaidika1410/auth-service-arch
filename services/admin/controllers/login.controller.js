const fs = require('fs/promises')
const bcrypt = require('bcrypt')

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
        const admins = JSON.parse(await fs.readFile('./data/admins.json', 'utf-8'))
        console.log('before condition')
        admins.forEach(async admin => {
            if(admin.email === email) {
                let compare = admin.password === password
                console.log(compare)
                if(compare) {
                    console.log('admin exist')
                    console.log(admin)

                    admin.status = 'active'

                    await fs.writeFile('./data/admins.json', JSON.stringify(admins), 'utf-8')
                }
            } else {
                throw "admin does not exist"
            }
        })

    } catch(error) {
        throw error
    }
}

module.exports = {adminLogin}