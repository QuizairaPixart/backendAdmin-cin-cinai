const {
  ActionsModel
} = require('../../../models/Sanitization/ActionsModelSanitize')
const { createAction, updateOrCreateAction, deviceActionCompleted } = require('../../Databases/CRUD-Actions')
const { readGroup } = require('../../Databases/CRUD-Client')
const {
  createTracking,
  updateTracking
} = require('../../Databases/CRUD-Locations')
const { updateOrCreateLossReport } = require('../../Databases/CRUD-LossReport')
const { updateStats } = require('../../Databases/CRUD-Stats')

// CRUD
const CreateAction = async (data) => {
  // console.log({ data })
  const res = []
  let tracking = true
  let userId
  const response = { result: false }
  // console.log(JSON.stringify({ data }))
  const sanitizes = ActionsModel(data)
  let flag = true
  for (const sanitize of sanitizes) {
    let action
    userId = sanitize.userId
    // console.log(sanitize)
    let flagUpdate = true
    //* logica de  NO encolamiento
    if (sanitize.action === 'disable' || sanitize.action === 'lock' || sanitize.action === 'tracking') {
      // console.log(sanitize, 'linea 30')
      const updateAction = await updateOrCreateAction(sanitize) // ? verifico y updateo accion
      action = updateAction.action
      flagUpdate = updateAction.create // ? si updateo la flag omito logicas
      if (updateAction?.disablePreviousAction) res.push(updateAction.disablePreviousAction.id)
    } else {
      // console.log(sanitize, 'linea 36')
      action = await createAction(sanitize)
    }
    if (sanitize.action === 'tracking') {
      tracking = await CreateRowTracking(sanitize)
    }

    // ? si se updatea se usa el flag para evitar que intente volver a asociar a los equipos/grupos a una accion que ya esta asociada
    if (sanitize.devicesId.length !== 0 && flagUpdate) {
      for (const device of sanitize.devicesId) {
        try {
          await action.addDevices(device)
        } catch (e) {
          console.error('addDeviceAction ', e)
        }
      }
    }
    if (sanitize.groupsId.length !== 0 && flagUpdate) {
      for (const group of sanitize.groupsId) {
        try {
          await action.addGroups(group)
        } catch (e) {
          console.error('addDeviceGroup ', e)
        }
      }
    }

    res.push(action.id)
    if (!res && tracking === true) {
      flag = false
    }
  }
  if (flag) {
    if (sanitizes.find((sanitize) => sanitize.action === 'lock' && sanitize.devicesId.length !== 0)) await updateOrCreateLossReport(res, userId)

    // console.log({ res })
    return { result: true, actions: res }
  }
  // console.log({ response })

  return response
}

const UpdateStat = async (data) => {
  if (data.id) {
    const statDB = await updateStats(data.id, data)
    if (statDB[0] === 1) {
      return { result: true, stats: statDB }
    }
  }
  return { result: false, stats: null }
}

const CreateRowTracking = async ({ devicesId, data, groupsId }) => {
  const devices = devicesId
  const sendTracking = { order_id: data.order_id }

  let flag = true
  if (groupsId && groupsId.length !== 0) {
    for (const group of groupsId) {
      const groupDB = await readGroup(group)
      for (const device of groupDB.devices) {
        devices.push(device.id)
      }
    }
  }
  for (const device of devices) {
    sendTracking.deviceId = device
    // console.log(sendTracking)
    let result
    if (data.statusTracking === false) {
      result = await updateTracking(sendTracking, {
        date_finish: Date('now').toString()
      })
    } else {
      result = await createTracking(sendTracking)
    }
    if (!result) {
      flag = false
    }
  }
  return flag
}

const ReadActionComplete = async (deviceId) => {
  const actions = await deviceActionCompleted(deviceId)
  return actions
}

module.exports = { CreateAction, UpdateStat, ReadActionComplete }
