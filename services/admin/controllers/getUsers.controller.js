const fs = require('fs/promises')

const getUsers = async () => {
    try {
        const users = JSON.parse(await fs.readFile('./data/userProfile.json', 'utf-8'))

        console.log(users)
        return users
    } catch(error) {
        throw error
    }
}

module.exports = {getUsers}