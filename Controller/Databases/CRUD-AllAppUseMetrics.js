const { SequelizeError } = require('../../middlewares/errors/AppError')
const { allAppUseMetrics } = require('../../models/Psql/AppUseTimesModel')
const { Op } = require('sequelize')

const readAllAppUseMetrics = async (id = null, date = null, table = null) => {
  try {
    let useTime = null
    const filter = []
    let where = null

    if (id) filter.push(['applicationId', id])
    if (date) filter.push(['date', { [Op.between]: date }])
    if (filter.length > 0) where = Object.fromEntries(filter)
    // console.log({ id, date, table })
    useTime = await allAppUseMetrics.findAll({
      where,
      include: table
    })

    return useTime
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
  readAllAppUseMetrics
}
