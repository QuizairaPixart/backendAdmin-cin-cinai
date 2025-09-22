const { SequelizeError } = require('../../middlewares/errors/AppError')
const { geofences } = require('../../models/Psql/GeofenceModel')
const { configGeofence } = require('../../models/Psql/ConfigGeofenceModel')

const readGeofences = async (id, tables = { all: true }) => {
  try {
    let geofence
    if (!id) geofence = await geofences.findAll({ include: tables })
    else geofence = await geofences.findOne({ where: id, include: tables })
    return geofence
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const createGeofence = async (data) => {
  try {
    if (data) {
      data.configGeofenceId = 1
      const geofence = await geofences.create(data)
      if (geofence instanceof geofences) return geofence
    } else return false
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateGeofence = async (id, data) => {
  try {
    const geofence = await geofences.update(data, {
      where: id,
      returning: true
    })
    if (geofence) return { result: true, geofence }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const removeGeofence = async (id) => {
  try {
    const geofence = await geofences.destroy({ where: id })
    if (geofence) return { result: true }
    else return { result: false }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// readConfigGeo
const readConfigGeo = async (id, tables = { all: true }) => {
  try {
    let geofence
    if (!id) geofence = await configGeofence.findAll({ include: tables })
    else { geofence = await configGeofence.findOne({ where: id, include: tables }) }
    return geofence
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const createConfigGeofence = async (data) => {
  try {
    const geofence = await configGeofence.create(data)
    if (geofence instanceof configGeofence) {
      // console.log(`geofence ${geofence.id} creado con exito`);
      return geofence
    } else return false
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateConfigGeofence = async (id, data) => {
  try {
    const geofence = await configGeofence.update(data, { where: id })
    if (geofence) return { result: true }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const removeConfigGeofence = async (id) => {
  try {
    const geofence = await configGeofence.destroy({ where: id })
    if (geofence) return { result: true }
    else return { result: false }
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
  readGeofences,
  createGeofence,
  updateGeofence,
  removeGeofence,
  readConfigGeo,
  createConfigGeofence,
  updateConfigGeofence,
  removeConfigGeofence
}
