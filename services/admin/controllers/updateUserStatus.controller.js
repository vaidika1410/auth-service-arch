const fs = require('fs/promises')

const updateStatus = async (id) => {
    try {
        const data = JSON.parse(await fs.readFile('../data/data.json', 'utf-8'))
        // const registeredUsers = JSON.parse(await fs.readFile('./data/users.json', 'utf-8'))

        const users = data[0].users
        // console.log(users)


        if (id.length < 10) {
            return res.status(400).json({
                message: "please provide a valid user-id"
            })
        }

        const user = users.find(user => user.userId.toString() === id.toString())

        if (user.status === 'inactive by admin') {
            throw "user status already updated by admin"
        }
        
        user.status = 'inactive by admin'

        console.log(user)

        // const u = registeredUsers.find(user => user.id.toString() === id.toString())
        // u.status = status

        // users.push(user)


        // console.log(user.status)
        await fs.writeFile('../data/data.json', JSON.stringify(data), 'utf-8')
        // await fs.writeFile('./data/users.json', JSON.stringify(registeredUsers), 'utf-8')

        return user

    } catch (error) {
        throw error
    }
}

module.exports = { updateStatus }