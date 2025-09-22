const { SequelizeError } = require('../../../middlewares/errors/AppError')
const { tickets } = require('../../../models/Rxart/TicketModel')

const getRxartTickets = async (deviceId = null) => {
  try {
    let ticket
    if (!deviceId) ticket = await tickets.findOne({ order: [['id', 'DESC']] })
    ticket = await tickets.findOne({ where: { deviceId }, order: [['id', 'DESC']] })

    return ticket
  } catch (error) {
    throw new SequelizeError(
      error.name,
      error.original ? error.original.routine + ' => ' + error.message : error.message,
      error.statusCode || 500,
      error.sql
    )
  }
}

module.exports = { getRxartTickets }
