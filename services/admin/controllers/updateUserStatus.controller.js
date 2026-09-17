const fs = require('fs/promises')

const updateStatus = async (params, id) => {
    try {
        const users = JSON.parse(await fs.readFile('./data/userProfile.json', 'utf-8'))
        const registeredUsers = JSON.parse(await fs.readFile('./data/users.json', 'utf-8'))

        const {status} = params

        // console.log(status)
        const user = users.find(user => user.id.toString() === id.toString())
        user.status = status

        const u = registeredUsers.find(user => user.id.toString() === id.toString())
        u.status = status
        
        // users.push(user)

        console.log(user.status)
        await fs.writeFile('./data/userProfile.json', JSON.stringify(users), 'utf-8')
        await fs.writeFile('./data/users.json', JSON.stringify(registeredUsers), 'utf-8')

        return user

    } catch (error) {
        throw error
    }
}

module.exports = {updateStatus}