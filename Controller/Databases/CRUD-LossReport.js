const { SequelizeError } = require('../../middlewares/errors/AppError')
const { lossReports } = require('../../models/Psql/ReportsModel')
const { readAction, readThief } = require('./CRUD-Actions')
const { readTracking } = require('./CRUD-Locations')

const createLossReport = async (data) => {
  try {
    const report = await lossReports.create(data)
    console.log(`report ${report.id} creado con exito`)
    return report
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readLossReport = async (id, table = null) => {
  try {
    let report
    if (id) {
      report = await lossReports.findAll({
        where: id,
        include: table
      })
    } else report = await lossReports.findAll()
    return report
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateLossReport = async (id, data) => {
  try {
    if (id && data) { return lossReports.update(data, { where: id }) }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}
const deleteLossReport = async (id) => {
  try {
    let report
    if (id)report = await lossReports.destroy({ where: id })
    return report
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateOrCreateLossReport = async (id, userId) => {
  console.log({ id, userId })
  const actions = await readAction({ id }, 'devices')

  let statusLock
  const newLoss = { userId }
  // eslint-disable-next-line camelcase
  for (const { id, action, data, createdAt, devices } of actions) {
    if (action === 'lock') {
      newLoss.actionId = id
      statusLock = data.statusLock
      if (data?.statusLock) newLoss.start_date = createdAt
      if (devices.length === 1) newLoss.deviceId = devices[0].id

      // eslint-disable-next-line camelcase
      newLoss.order_id = data.order_id
      // eslint-disable-next-line camelcase
      if (data?.photo?.status && data?.order_id) newLoss.thiefId = (await readThief({ order_id: data?.order_id })).id
    // eslint-disable-next-line camelcase
    } else if (action === 'tracking' && data?.statusTracking && data?.order_id) newLoss.trackingId = (await readTracking({ order_id: data?.order_id }))[0].id
  }
  console.log(newLoss, 'linea 89')
  if (statusLock) { createLossReport(newLoss) } else {
    // console.log(newLoss.deviceId)
    const updateLoss = await lossReports.findOne({ where: { deviceId: newLoss.deviceId }, order: [['id', 'DESC']] })
    // console.log({ updateLoss })
    updateLoss.finish_date = Date.now()
    updateLoss.save()
  }
}

const updateLossReportWithDenunciation = async (denunciationId, orderId, deviceId) => {
  // console.log(denunciationId, orderId, deviceId)
  const updateLossReport = await lossReports.findOne({ where: { order_id: orderId, deviceId } })

  // console.log(updateLossReport)

  if (updateLossReport) {
    updateLossReport.denunciationId = denunciationId
    updateLossReport.save()
  }

  return updateLossReport
}
module.exports = {
  createLossReport,
  readLossReport,
  updateLossReport,
  deleteLossReport,
  updateOrCreateLossReport,
  updateLossReportWithDenunciation
}
