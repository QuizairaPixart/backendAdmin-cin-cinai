const { readAllConnections } = require('../../Databases/CRUD-AllConnections')
const { readNotifications, updateNotifications } = require('../../Databases/CRUD-Notifications')
const { getDate, getStats, getMissingDevices } = require('../Actions/DevicesCtrl')
const { getMapsAll } = require('../Actions/LocationsCtrl')

const getHomeConnections = async (req, res = { status: 500, send: { auth: false } }) => {
  const charts = await getDate()
  if (!charts) return res

  return { status: 200, send: charts }
}

const getHomeAllConnections = async (req, res = { status: 500, send: { auth: false } }) => {
  let days = req?.params?.days
  if (days) days = parseInt(days)
  const charts = await readAllConnections(days)
  if (!charts) return res

  return { status: 200, send: charts }
}

const getHomeMissingDevices = async (req, res = { status: 500, send: { auth: false } }) => {
  const charts = await getMissingDevices()
  if (!charts) return res

  return { status: 200, send: charts }
}

const getHomeStats = async (req, res = { status: 500, send: { auth: false } }) => {
  const stats = await getStats()
  if (!stats) return res

  return { status: 200, send: stats }
}

const getHomeLocations = async (req, res = { status: 500, send: { auth: false } }) => {
  const map = await getMapsAll()
  if (!map) return res

  return { status: 200, send: map }
}

const GetNotifications = async (req, res = { status: 500, send: { auth: false } }) => {
  const notifications = await readNotifications()

  if (!notifications) return res

  return { status: 200, send: notifications }
}

const PutNotifications = async (req, res = { status: 500, send: { auth: false } }) => {
  const ids = req?.body

  const notifications = await updateNotifications(ids, { seen: true })

  if (notifications) {
    res.status = 200
    res.send = { result: true }
  }
  return res
}

module.exports = { getHomeConnections, getHomeAllConnections, getHomeMissingDevices, getHomeStats, getHomeLocations, GetNotifications, PutNotifications }
