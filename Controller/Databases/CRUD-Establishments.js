const { establishments } = require('../../models/Psql/EstablishmentsModel')
const { SequelizeError } = require('../../middlewares/errors/AppError')

const createEstablishments = async (data) => {
  try {
    await establishments.bulkCreate(data).then((res) => {
      console.log('establecimientos creados con éxito!', res.length)
    })

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

module.exports = { createEstablishments }
