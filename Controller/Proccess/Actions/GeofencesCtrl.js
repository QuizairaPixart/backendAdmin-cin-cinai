const {
  readGeofences,
  createGeofence,
  updateGeofence,
  removeGeofence,
  readConfigGeo,
  createConfigGeofence,
  updateConfigGeofence,
  removeConfigGeofence
} = require('../../Databases/CRUD-Geofences')

const getGeofences = async (id) => {
  const geofences = await readGeofences(id)
  if (geofences) return geofences
}

const postGeofence = async (data) => {
  const existGeofence = await readGeofences({ name: data.name })
  if (existGeofence) return { result: false }

  const geofence = await createGeofence(data)
  if (geofence) return { result: true, geofence }
}

const putGeofence = async (id, data) => {
  const geofences = await updateGeofence(id, data)
  if (geofences) return geofences
}

const deleteGeofence = async (id) => {
  const geofences = await removeGeofence(id)
  if (geofences) return geofences
}

const getConfigGeofences = async (id) => {
  const geofences = await readConfigGeo(id)
  if (geofences) return geofences
}

const postConfigGeofence = async (data) => {
  const existGeofence = await readConfigGeo({ geofenceId: data.geofenceId })
  if (existGeofence) return { result: false }

  const geofence = await createConfigGeofence(data)
  if (geofence) return { result: true }
}

const putConfigGeofence = async (id, data) => {
  const geofences = await updateConfigGeofence(id, data)
  if (geofences) return geofences
}

const deleteConfigGeofence = async (id) => {
  const geofences = await removeConfigGeofence(id)
  if (geofences) return geofences
}

module.exports = {
  getGeofences,
  postGeofence,
  putGeofence,
  deleteGeofence,
  getConfigGeofences,
  postConfigGeofence,
  putConfigGeofence,
  deleteConfigGeofence
}
