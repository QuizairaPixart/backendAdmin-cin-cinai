const { SequelizeError } = require('../../middlewares/errors/AppError')
const { roles } = require('../../models/Psql/RolesModel')

const createRoles = async (data) => {
  try {
    let role
    if (data) {
      role = await roles.create(data)
      if (role instanceof roles) {
        console.log(`rolelist ${role.id} creado con exito!  `)
      }
    }
    return role
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}
const readRoles = async (id, tables = null) => {
  try {
    let role
    if (id) {
      role = await roles.findOne({
        where: id,
        include: tables
      })
    } else {
      role = await roles.findAll()
    }
    return role
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateRoles = async (id, data, tables) => {
  try {
    await roles.update(data, { where: id })
    return true
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const deleteRoles = async (id) => {
  try {
    const role = await roles.destroy({ where: id })
    if (role) return { result: true }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

module.exports = {
  createRoles,
  readRoles,
  updateRoles,
  deleteRoles
}
