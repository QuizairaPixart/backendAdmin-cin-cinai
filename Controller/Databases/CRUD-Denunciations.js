const { SequelizeError } = require('../../middlewares/errors/AppError')
const { denunciations } = require('../../models/Psql/DenunciationModel')
const { devices } = require('../../models/Psql/DeviceModel')
const { users } = require('../../models/Psql/UsersModel')

const createDenunciation = async (data) => {
  try {
    const denunciation = await denunciations.create(data)
    console.log(`denunciation ${denunciation.id} creado con exito`)
    return denunciation
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readDenunciation = async (id, table = null) => {
  try {
    let denunciation
    if (id) {
      denunciation = await denunciations.findOne({
        where: id,
        include: [{ model: users, as: 'closeUser' }, { model: users, as: 'user' }, { model: devices }]
      })
    }
    return denunciation
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readDenunciations = async (filter, table = null) => {
  try {
    let denunciationsDB
    if (filter) {
      denunciationsDB = await denunciations.findAll({
        where: filter,
        include: [{ model: users, as: 'closeUser' }, { model: users, as: 'user' }, { model: devices }]
      })
    } else {
      denunciationsDB = await denunciations.findAll({
        include: [{ model: users, as: 'closeUser' }, { model: users, as: 'user' }, { model: devices }]
      })
    }
    return denunciationsDB
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateDenunciation = async (id, data) => {
  try {
    const denunciation = await denunciations.update(data, {
      where: id,
      returning: true
    })

    if (denunciation) return { result: true, denunciation: denunciation[1][0] }
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

module.exports = {
  createDenunciation,
  readDenunciation,
  readDenunciations,
  updateDenunciation
}
