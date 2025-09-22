const { readUser } = require('../Controller/Databases/CRUD-Client')
const { createDefaultUser, createDefaultRoles } = require('../helpers/RestoreDB')

const findAndCreateDefaultUser = async () => {
  if ((await readUser(1) === null)) {
    const user = await createDefaultUser()
    const roles = await createDefaultRoles()
    user.addRoles(roles.id)
  }
}

module.exports = { findAndCreateDefaultUser }
