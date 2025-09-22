const { SequelizeError } = require('../../middlewares/errors/AppError')
const { trackings, locations } = require('../../models/Psql/LocationsModel')
const { Op } = require('sequelize')
// const sequelize = require('sequelize')
const { literal } = require('sequelize')

// LOCATIONS//---------------------
// read locations
const readLocations = async (id, day) => {
  try {
    let location
    if (id) {
      location = await locations.findAll({
        where: {
          deviceId: id,
          date: { [Op.between]: [new Date(day), new Date()] }
          // type: ['SO', 'so']
        }
      })
    }
    return location
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read last_location
const readLastLocation = async (id) => {
  try {
    let location
    if (id) {
      location = await locations.findOne({
        where: {
          deviceId: id
        },
        order: [['date', 'DESC']]
      })
    }
    return location
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// TRACKING//----------------------
// create tracking
const createTracking = async (data) => {
  try {
    let tracking
    if (data.deviceId && data.order_id) {
      tracking = await trackings.create(data)
      if (tracking instanceof trackings) {
        console.log(`tracking ${tracking.id} creado con exito!  `)
      }
    }
    return tracking
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read tracking
const readTracking = async (id, table = null) => {
  try {
    let tracking
    if (id) {
      tracking = await trackings.findAll({
        where: id,
        include: table,
        order: [['id', 'DESC']]
      })
    } else {
      tracking = await trackings.findAll({ include: table })
    }
    return tracking
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// update tracking
const updateTracking = async (id, data) => {
  try {
    const tracking = await trackings.update(data, { where: id })
    return tracking
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readMap = async () => {
  try {
    const location = await locations.findAll({
      where: { type: ['SO', 'so'] },
      // attributes: [
      //   sequelize.fn('', sequelize.col('locations.deviceId')),
      //   'lat',
      //   'lon',
      //   'acc',
      //   'date',
      //   'deviceId'
      // ],
      attributes: [
        literal(' DISTINCT ON ("deviceId") "deviceId"'), 'deviceId',
        'lat',
        'lon',
        'acc',
        'date'
      ],
      order: [['deviceId', 'ASC'], ['date', 'DESC']],
      limit: 300
    })
    return location
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
  readLocations,
  readLastLocation,
  createTracking,
  readTracking,
  updateTracking,
  readMap
}
