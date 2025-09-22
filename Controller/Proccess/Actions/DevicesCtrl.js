const { statsDataFormat } = require('../../../helpers/statsDataFormat')
const devicePSQL = require('../../Databases/CRUD-Devices')
const { readStatsMetrics } = require('../../Databases/CRUD-Stats')
// date for devices

const getDate = async (devices) => {
  const countConn = await devicePSQL.readDates()
  return countConn
}

const getMissingDevices = async (devices) => {
  const countConn = await devicePSQL.readMissingDevices()
  return countConn
}

const getDevices = async (id, table, params = null) => {
  const deviceDB = await devicePSQL.readDevice(id, table, params)
  return deviceDB
}

const deleteDevice = async (id) => {
  const deviceDB = await devicePSQL.deleteDevice(id)
  return deviceDB
}

const putDevice = async (id, data, table) => {
  delete data?.id
  const device = await devicePSQL.updateDevice(id, data, table)
  return device
}

const getStats = async () => {
  const stats = await readStatsMetrics()
  stats?.sort((a, b) => new Date(b.date) - new Date(a.date))

  const lastStat = stats[0]
  let percentageRam = statsDataFormat(lastStat?.Ram.available, lastStat?.Ram.total)
  let percentageDisk = statsDataFormat(lastStat?.Disk.available, lastStat?.Disk.total)

  if (isNaN(percentageDisk)) percentageDisk = null
  if (isNaN(percentageRam)) percentageRam = null

  return { Ram: lastStat?.Ram, Disk: lastStat?.Disk, percentageRam, percentageDisk, date: lastStat?.date }
}

// const bytesToSize = async (bytes) => {
//   if (!bytes) return '0 Byte'
//   const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
//   return Math.round(bytes / Math.pow(1024, i), 2)
// }

// const overallPercentage = async (available, total) => {
//   return Math.round((parseFloat(available) * 100) / parseFloat(total))
// }

// const individualPercentage = async (available, total) => {
//   const availableBytes = await bytesToSize(available)
//   const totalBytes = await bytesToSize(total)
//   return Math.round((availableBytes * 100) / totalBytes)
// }

module.exports = { getDevices, putDevice, getDate, getStats, deleteDevice, getMissingDevices }
