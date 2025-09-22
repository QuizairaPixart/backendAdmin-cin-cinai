const { statsDataFormat } = require('../../../helpers/statsDataFormat')
const { readAppUseTimes } = require('../../Databases/CRUD-AppUseTimes')
// const { readUser } = require('../../Databases/CRUD-Client')
const { readConnections } = require('../../Databases/CRUD-Connections')
const { readDevice, readAppsDevices, readLog, readDevicesLocationsReports } = require('../../Databases/CRUD-Devices')
const { readDeviceUseMetrics } = require('../../Databases/CRUD-DeviceUseMetrics')
const {
  readLocations,
  readLastLocation,
  readTracking
} = require('../../Databases/CRUD-Locations')
const {
  readLossReport
} = require('../../Databases/CRUD-LossReport')
const { readStats } = require('../../Databases/CRUD-Stats')
const {
  getDevices,
  putDevice,
  deleteDevice
} = require('../Actions/DevicesCtrl')

// get devices
const GetDevices = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  let devices
  let { pagination } = req.params
  if (pagination) pagination = JSON.parse(pagination)
  if (req.url.includes('/reports')) {
    devices = await readDevice(null, ['groups', 'stat'], pagination)
  } else {
    /* const user = await readUser({
      id: JSON.parse(req.headers.authorization).userId
    }) */

    // Leo y guardo los equipos asociados a un grupo donde incluya los grupos que pertenecen al usuario logueado
    if (JSON.parse(req.headers.authorization).userId === -1 /* || user.groups.length === 0 */) {
      devices = await readDevice(null, ['groups', 'stat'], pagination)
    } /* else {
      devices = await readDevice(
        null,
        [
          {
            association: 'groups',
            include: [
              {
                association: 'users',
                where: { id: user.id },
                required: true
              }
            ],
            required: true
          },
          'stat'
        ],
        pagination
      )
    } */
  }
  if (devices) {
    response.status = 200
    response.send = devices
  }

  return response
}
// dashboard
const GetDevice = async (req, res) => {
  const response = { status: 500, send: { auth: false } }

  const devices = await getDevices({ id: req.params.id }, ['establishment', 'groups'])
  if (devices) {
    response.status = 200
    response.send = devices
  }
  return response
}

const GetDeviceStats = async (req, res) => {
  const response = { status: 500, send: { auth: false } }

  const devices = await readStats({ deviceId: req.params.id })
  const lastRam = devices?.Ram[(devices?.Ram.length - 1)]
  const lastDisk = devices?.Disk[(devices?.Disk.length - 1)]

  let percentageRam = statsDataFormat(lastRam?.available, lastRam?.total)
  let percentageDisk = statsDataFormat(lastDisk?.available, lastDisk?.total)

  if (isNaN(percentageDisk)) percentageDisk = null
  if (isNaN(percentageRam)) percentageRam = null

  // console.log(devices, percentageDisk, percentageRam)

  response.status = 200
  response.send = { Battery: devices?.Battery[devices?.Battery.length - 1], percentageDisk, percentageRam, checkAlert: devices?.checkAlert, countOverDisk: devices?.countOverDisk, countOverRam: devices?.countOverRam, countOverBattery: devices?.countOverBattery, deviceId: devices?.deviceId, last_date: devices?.last_date }
  return response
}

const GetStatsDevice = async (req, res = { status: 500, send: { auth: false } }) => {
  const stats = await readStats('stats-device-report', 'device')

  const devices = []
  if (stats?.length > 0) {
    stats.forEach(element => {
      const item = {
        Ram: element.Ram[(element?.Ram.length - 1)],
        Disk: element.Disk[(element?.Disk.length - 1)],
        Battery: element.Battery[(element?.Battery.length - 1)],
        Device: element.device
      }

      devices.push(item)
    })
  }

  res.status = 200
  res.send = devices
  return res
}

const GetDeviceConnections = async (
  req,
  res = { status: 500, send: { auth: false } }
) => {
  let connections = null
  const id = req.params.id
  if (!id) return res

  // let day = new Date()
  // const dayPlus = day.setDate(day.getDate() - 6)
  // day = new Date(dayPlus).toISOString().split('T')[0]
  const dayPlus = new Date().setUTCDate(new Date().getUTCDate() - 6)
  const start = new Date(dayPlus).toISOString().split('T')[0]
  const yesterdayPlus = new Date().setUTCDate(new Date().getUTCDate())
  const end = new Date(yesterdayPlus).toISOString().split('T')[0]

  // connections = await readConnections(id, day)
  connections = await readConnections(id, start, end)

  if (!connections) return res
  connections?.sort((a, b) => a.id - b.id)

  return { status: 200, send: connections }
}

const GetDevicesUseTime = async (req, res = { status: 500, send: { auth: false } }) => {
  const date = req?.params?.time
  let id = req?.params?.id
  let devicesUseTime

  if (id) {
    id = parseInt(id)
    devicesUseTime = await readDeviceUseMetrics(date, id)
  } else {
    devicesUseTime = await readDeviceUseMetrics(date, id)
  }

  let useTime = 0

  devicesUseTime?.forEach(({ totalTimeSeconds }) => {
    useTime = useTime + totalTimeSeconds
  })

  if (!devicesUseTime) return res

  return { status: 200, send: { devicesUseTime, useTime } }
}

const GetDeviceLocations = async (
  req,
  res = { status: 500, send: { auth: false } }
) => {
  let locations = null
  const id = req.params.id
  if (!id) return res

  let day = new Date()
  const dayPlus = day.setDate(day.getDate() - 7)
  day = new Date(dayPlus).toISOString().split('T')[0]
  locations = await readLocations(id, day)

  if (!locations) return res
  locations?.sort((a, b) => a.id - b.id)
  return { status: 200, send: locations }
}

const GetDeviceLastLocation = async (
  req,
  res = { status: 500, send: { auth: false } }
) => {
  // eslint-disable-next-line camelcase
  let last_location = null
  const id = req.params.id
  if (!id) return res

  // eslint-disable-next-line camelcase
  last_location = await readLastLocation(id)

  // eslint-disable-next-line camelcase
  return { status: 200, send: { last_location } }
}

const GetDeviceLastLocationReports = async (
  req,
  res = { status: 500, send: { auth: false } }
) => {
  const { dateFilter } = JSON.parse(req?.params?.dateFilter)

  const devicesDB = await readDevicesLocationsReports(dateFilter)

  if (devicesDB) {
    res.status = 200
    res.send = devicesDB
  }

  return res
}

const GetDeviceApplications = async (
  req,
  res = { status: 500, send: { auth: false } }
) => {
  let apps = null
  let appsUseTime = null
  let date = new Date()
  date = date.setDate(date.getDate() - 1)
  date = new Date(date).toISOString().split('T')[0]
  const id = req.params.id

  if (!id) return res

  apps = await readAppsDevices(id, 'applications')
  appsUseTime = await readAppUseTimes({ deviceId: id, applicationId: apps.map(app => app.id) })
  apps = apps.map(app => app.toJSON())
  appsUseTime = appsUseTime.map(app => app.toJSON())

  appsUseTime = appsUseTime.filter((app) => new Date(app.date).toISOString().split('T')[0] === date)

  appsUseTime.forEach(application => {
    let i = false
    apps.forEach((app, index) => {
      delete app.devicesApplication
      app.last_date = null
      if (application.applicationId === app.id) {
        application.name = app.app
        i = index
      }
    })
    if (i) {
      apps[i].useTime = application.totalTimeSeconds
      apps[i].dateUseTime = application.date
      i = false
    }
  })

  appsUseTime = appsUseTime.sort(function (a, b) {
    return b.totalTimeSeconds - a.totalTimeSeconds
  })

  if (appsUseTime.length > 5) appsUseTime = appsUseTime.slice(0, 5)

  if (!apps) return res

  return { status: 200, send: { apps, labels: appsUseTime.map(app => app.name), useTime: appsUseTime.map(app => app.totalTimeSeconds) } }
}

const GetDeviceTracking = async (
  req,
  res = { status: 500, send: { auth: false } }
) => {
  let tracking = null
  const id = req.params.id
  if (!id) return res

  tracking = await readTracking({ deviceId: id })

  if (!tracking) return res

  return { status: 200, send: tracking }
}

const GetDeviceLossReports = async (
  req,
  res = { status: 500, send: { auth: false } }
) => {
  let lossReports = null
  const id = req.params.id
  if (!id) return res

  lossReports = await readLossReport({ deviceId: id }, 'user')

  if (!lossReports) return res

  return { status: 200, send: lossReports }
}

const GetDeviceDebugLog = async (req, res = { status: 500, send: { auth: false } }) => {
  let log = null
  const deviceId = req.params.id
  if (!deviceId) return res

  log = await readLog({ deviceId })
  if (!log) return res

  return { status: 200, send: log }
}

const GetTrackingsThief = async (
  req,
  res = { status: 500, send: { auth: false } }
) => {
  let tracking = null
  const id = +req.params.id
  if (!id) return res
  tracking = await readTracking(id)
  if (!tracking) return res
  return { status: 200, send: tracking }
}

const PutDevice = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const devices = await putDevice({ id: req.body.id }, req.body, 'groups')
  if (devices) {
    response.status = 200
    response.send = { result: true }
  }
  return response
}
const DeleteDevice = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const devices = await deleteDevice({ id: req.params.id })
  if (devices) {
    response.status = 200
    response.send = devices
  }
  return response
}

// action buttons

module.exports = {
  GetDevices,
  GetDevice,
  GetDeviceConnections,
  GetDeviceLocations,
  GetDeviceLastLocation,
  GetDeviceLastLocationReports,
  GetDeviceApplications,
  GetDeviceTracking,
  GetDeviceLossReports,
  GetDeviceDebugLog,
  PutDevice,
  DeleteDevice,
  GetDeviceStats,
  GetStatsDevice,
  GetTrackingsThief,
  GetDevicesUseTime
}
