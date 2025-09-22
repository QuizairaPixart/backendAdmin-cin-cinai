const { SequelizeError } = require('../../middlewares/errors/AppError')
const { establishments } = require('../../models/Psql/EstablishmentsModel')

const readEstablishments = async (id, tables = null) => {
  try {
    let data
    if (!id) data = await establishments.findAll({ include: tables })
    else data = await establishments.findOne({ where: id, include: tables })
    return data
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

module.exports = { readEstablishments }
