const { SequelizeError } = require('../../middlewares/errors/AppError')
const { Op } = require('sequelize')
const { events } = require('../../models/Psql/EventsModel')

const readEvents = async (filter, type, table = null) => {
  try {
    let items
    if (filter) {
      if (type === 'softwareEvents') {
        items = await events.findAll({
          where: { type_event_id: { [Op.or]: filter } },
          include: table
        })
      } else if (type === 'devicesEvents') {
        items = await events.findAll({
          where: { type_event_id: { [Op.notIn]: filter } },
          include: table
        })
      }
    } else {
      items = await events.findAll({
        include: table
      })
    }
    return items
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
  readEvents
}
