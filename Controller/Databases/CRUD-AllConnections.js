const { SequelizeError } = require('../../middlewares/errors/AppError')
const { allConnectionsMetrics } = require('../../models/Psql/DeviceModel')
const { Op } = require('sequelize')

const readAllConnections = async (days = null) => {
  try {
    // console.log(days, 'línea 7')
    let connections = null
    let startDate = new Date()
    startDate = startDate.setDate(startDate.getDate() - days)
    startDate = new Date(startDate)?.toISOString().split('T')[0] + ' 00:00:00.000 +00:00'

    let endDate = new Date()
    endDate = new Date(endDate)?.toISOString().split('T')[0] + ' 23:59:59.000 +00:00'

    const filter = { [Op.between]: [startDate, endDate] }

    connections = await allConnectionsMetrics.findAll({
      where: {
        date: filter
      }
    })

    return connections
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
  readAllConnections
}
