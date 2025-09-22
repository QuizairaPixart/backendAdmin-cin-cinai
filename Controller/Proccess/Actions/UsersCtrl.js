const { usersRole } = require('../../../models/Psql/Asociations')
const clientPSQL = require('../../Databases/CRUD-Client')

const getUsers = async (id) => {
  const users = await clientPSQL.readUser(id)
  return users
}

const postUsers = async (data) => {
  if (!data || !Number.isInteger(data.range)) return { result: false }
  const findUser = await clientPSQL.readUser({ user: data.user })
  const findEmail = await clientPSQL.readUser({ email: data.email })
  // null
  if (!data.user || !data.email || !data.password || !data.range) {
    return {
      result: null,
      user: data.user,
      email: data.email,
      password: data.password,
      range: data.range
    }
  }
  // false
  if (findUser !== null || findEmail !== null) {
    return {
      result: false,
      user: findUser === null,
      email: findEmail === null
    }
  }

  const newUser = await clientPSQL.createUser(data)
  if (newUser) {
    const userRoles = data.roles.map(role => { return { userId: newUser.id, roleId: role.id } })
    // crea o actualiza los registros en la tabla intermedia
    await usersRole.bulkCreate(userRoles, {
      ignoreDuplicates: true,
      returning: true
    })
    // elimina los registros en la tabla intermedia donde el userId no se encuentra en el arreglo userRolesToUpdate
    return { result: true }
  }
}
const putUsers = async (id, data) => {
  const users = await clientPSQL.updateUser(id, data)

  if (users) {
    await usersRole.destroy({
      where: {
        userId: data.id
      }
    })
    const userRoles = data.roles.map(role => { return { userId: data.id, roleId: role.id } })
    // console.log({ userRoles })
    // crea o actualiza los registros en la tabla intermedia
    await usersRole.bulkCreate(userRoles, {
      ignoreDuplicates: true,
      returning: true
    })
    return { result: true }
  }
}
const deleteUsers = async (id) => {
  const users = await clientPSQL.deleteUser(id)
  return users
}

module.exports = { getUsers, postUsers, putUsers, deleteUsers }
