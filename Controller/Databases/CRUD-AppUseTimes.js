const { literal } = require('sequelize')
const { SequelizeError } = require('../../middlewares/errors/AppError')
const { appUseTimes } = require('../../models/Psql/AppUseTimesModel')
const { Op } = require('sequelize')

const readAppUseTimes = async (id, day = null, table = null) => {
  try {
    let appUseTime
    if (id) {
      appUseTime = await appUseTimes.findAll({
        where: id,
        attributes: [
          literal(' DISTINCT ON ("applicationId") "applicationId"'), 'applicationId',
          'totalTimeSeconds',
          'date'
        ],
        order: [['applicationId', 'ASC'], ['date', 'DESC']]
      })
    } else if (day) {
      appUseTime = await appUseTimes.findAll({
        where: {
          date: {
            [Op.between]: [
              new Date(day + ' 00:00:00.000 +00:00'),
              new Date(day + ' 23:59:59.000 +00:00')
            ]
          }
        },
        include: table
      })
    } else {
      appUseTime = await appUseTimes.findAll({ include: table })
    }
    return appUseTime
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
  readAppUseTimes
}
