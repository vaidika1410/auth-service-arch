const fs = require('fs/promises')

const getUsers = async () => {
    try {
        const data = JSON.parse(await fs.readFile('../data/data.json', 'utf-8'))
        const users = data[0].users

        // console.log(users)
        return users
    } catch(error) {
        throw error
    }
}

module.exports = {getUsers}