const { SequelizeError } = require('../../middlewares/errors/AppError')
const { missingDevices } = require('../../models/Psql/MissingDevicesModel')
const { devices } = require('../../models/Psql/DeviceModel')
const { users } = require('../../models/Psql/UsersModel')

const createMissingDevice = async (data) => {
  try {
    const deviceDB = await missingDevices.create(data)
    console.log(`missing device ${deviceDB.id} creado con exito`)
    return deviceDB
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readMissingDevice = async (id, table = null) => {
  try {
    let deviceDB
    if (id) {
      deviceDB = await missingDevices.findOne({
        where: id,
        include: table
      })
    }
    return deviceDB
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateMissingDevice = async (id, data) => {
  try {
    const deviceDB = await missingDevices.update(data, {
      where: id,
      returning: true
    })
    if (deviceDB) return { result: true, deviceDB }
    return { result: false }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readMissingDevices = async (filter, table = null) => {
  try {
    let missingDevicesDB
    if (filter) {
      missingDevicesDB = await missingDevices.findAll({
        where: filter,
        include: [{ model: users, as: 'closeUserMissingDevices' }, { model: users, as: 'userMissingDevices' }, { model: devices }]
      })
    } else {
      missingDevicesDB = await missingDevices.findAll({
        include: [{ model: users, as: 'closeUserMissingDevices' }, { model: users, as: 'userMissingDevices' }, { model: devices }]
      })
    }
    return missingDevicesDB
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
  createMissingDevice,
  readMissingDevice,
  updateMissingDevice,
  readMissingDevices
}
