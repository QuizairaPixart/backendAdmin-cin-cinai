const { SequelizeError } = require('../../middlewares/errors/AppError')
const { notifications } = require('../../models/Psql/NotificationsModel')

const readNotifications = async (id = null) => {
  try {
    let data
    if (id) {
      data = await notifications.findAll({
        where: {
          deviceId: id,
          seen: false
        },
        include: { association: 'device' }
      })
    } else {
      data = await notifications.findAll({
        where: {
          seen: false
        },
        include: { association: 'device' }
      })
    }
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

const updateNotifications = async (ids = null, array) => {
  try {
    // console.log(ids)
    const data = await notifications.update(array, {
      where: {
        id: ids
      }
    })
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

module.exports = {
  readNotifications,
  updateNotifications
}
