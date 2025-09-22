const { SequelizeError } = require('../../middlewares/errors/AppError')
const { Op } = require('sequelize')
const { connections } = require('../../models/Psql/DeviceModel')
// CONNECTIONS//---------------------
// read connections
const readConnections = async (id, day, yesterday) => {
  try {
    let connection
    if (id) {
      connection = await connections.findAll({
        where: {
          deviceId: id,
          date: {
            [Op.between]: [
              // new Date(day + ' 00:00:00.000 +00:00'), new Date()
              day + ' 00:00:00.000 +00:00',
              yesterday + ' 23:59:59.000 +00:00'
            ]
          }
        }
      })
    }
    return connection
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
  readConnections
}
