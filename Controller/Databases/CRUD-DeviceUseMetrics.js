const { SequelizeError } = require('../../middlewares/errors/AppError')
const { deviceUseTimes } = require('../../models/Psql/DeviceUseTimesModel')
const { Op } = require('sequelize')

const readDeviceUseMetrics = async (date = null, id = null) => {
  try {
    let devicesUseTime = null
    let filter = null
    const today = new Date()?.toISOString().split('T')[0]
    const paramsDate = date.split(',')

    if (date) {
      if (paramsDate.includes(today)) filter = { [Op.eq]: today }
      else filter = { [Op.between]: [paramsDate[0], paramsDate[1]] }
    }

    if (id && date) {
      devicesUseTime = await deviceUseTimes.findAll({
        where: {
          deviceId: id,
          date: filter
        }
      })
    } else {
      devicesUseTime = await deviceUseTimes.findAll({
        where: {
          date: filter
        }
      })
    }

    return devicesUseTime
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
  readDeviceUseMetrics
}
