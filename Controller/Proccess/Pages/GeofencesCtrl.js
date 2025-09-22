const {
  getGeofences,
  postGeofence,
  putGeofence,
  deleteGeofence,
  getConfigGeofences,
  postConfigGeofence,
  putConfigGeofence,
  deleteConfigGeofence
} = require('../Actions/GeofencesCtrl')

// get geofences
const GetOneGeofence = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const geofence = await getGeofences({ id: parseInt(req.params.id) }, req)
  if (geofence) {
    response.status = 200
    response.send = geofence
  }
  return response
}

const GetGeofences = async (req, res) => {
  const response = { status: 500, send: { auth: false } }

  const geofences = await getGeofences(null, req)
  if (geofences) {
    response.status = 200
    response.send = geofences
  }
  return response
}

// post geofences
const PostGeofence = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const geo = await postGeofence(req?.body)

  if (geo.result === false || geo.result === null) {
    response.status = 400
    response.send = geo
  } else {
    response.status = 201
    response.send = { result: geo.result }
    req.locals = { geofences: geo?.geofence.toJSON() }
  }
  return response
}

const PutGeofence = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const { body } = req
  const id = +body?.id

  const geo = await putGeofence({ id }, body)

  if (geo) {
    response.status = 201
    response.send = { result: geo.result }
    req.locals = { geofences: geo?.geofence[1][0]?.toJSON() }
  }
  return response
}

const DeleteGeofence = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const geofence = await deleteGeofence({ id: +req.params.id })
  if (geofence) {
    response.status = 201
    response.send = geofence
  }
  return response
}

// get config-geofences
const GetConfigGeo = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const geofence = await getConfigGeofences({ id: parseInt(req.params.id) }, req)
  if (geofence) {
    response.status = 200
    response.send = geofence
  }
  return response
}

const GetConfigGeofences = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const geofence = await getConfigGeofences(null)
  // let geofence = await getConfigGeofences(null, req);
  if (geofence) {
    response.status = 200
    response.send = geofence
  }
  return response
}

// post config-geofences
const PostConfigGeofence = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const data = req.body
  const geofence = await postConfigGeofence(data)
  if (geofence.result === false || geofence.result === null) {
    response.status = 400
    response.send = geofence
  } else {
    response.status = 201
    response.send = geofence
  }
  return response
}

const PutConfigGeofence = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const data = req.body
  const geofence = await putConfigGeofence({ id: data.id }, data)
  if (geofence) {
    response.status = 201
    response.send = geofence
  }
  return response
}

const DeleteConfigGeofence = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const geofence = await deleteConfigGeofence({ id: +req.params.id })
  if (geofence) {
    response.status = 200
    response.send = geofence
  }
  return response
}

module.exports = {
  GetGeofences,
  GetOneGeofence,
  PostGeofence,
  PutGeofence,
  DeleteGeofence,
  GetConfigGeo,
  GetConfigGeofences,
  PostConfigGeofence,
  PutConfigGeofence,
  DeleteConfigGeofence
}
