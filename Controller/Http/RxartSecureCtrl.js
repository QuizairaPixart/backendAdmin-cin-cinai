const { throwAppError } = require('../../middlewares/errors/AppError')
const { totalDevices, getDevices, getDevicesPixtech, getLastTicket, updateStatus, getPreferencesClient, updatePreferencesClient, setDevices, calculateUnlockCode, getPreferencesDevice, updatePreferencesDevice, getProject, updatePreferencesProject, getPreferences, updatePreferences, registerLicenseDevice } = require('../Proccess/Actions/RxartSecureCtrl')
const { getDevices: getDevicesMdm } = require('../Proccess/Actions/DevicesCtrl')
const { readLastLocation } = require('../Databases/CRUD-Locations')

const countDevices = async (req, res) => {
  try {
    const result = await totalDevices(req)
    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_TOTAL_DEVICES')
  }
}

const queryDevices = async (req, res) => {
  try {
    const result = await getDevices(req)
    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_QUERY_DEVICES')
  }
}

const queryDevicesPixtech = async (req, res) => {
  try {
    const result = await getDevicesPixtech(req)
    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_QUERY_DEVICES_PIXTECH')
  }
}

const querySearchDevices = async (req, res) => {
  try {
    let result = { status: 500, send: { auth: false } }
    let filter = req?.params?.filter
    filter = JSON.parse(filter)

    let deviceRxart = null
    let deviceMdm = null
    let lastLocation = null

    if (filter?.deviceId) req.params.deviceId = filter?.deviceId.toLowerCase()
    if (filter?.serialBios) req.params.serialBios = filter?.serialBios

    const request1 = await getDevicesPixtech(req)
    // console.log(request1, 'línea 38')
    if (request1.status === 200) deviceRxart = request1.send
    // console.log(deviceRxart, 'línea 39')

    deviceMdm = await getDevicesMdm({ id_rxart: deviceRxart?.deviceId })
    // console.log(deviceMdm)

    const id = deviceMdm?.id
    lastLocation = await readLastLocation(id)
    // console.log(lastLocation), 'línea'

    if (!deviceRxart) result = { status: 406, send: { error: 'No Devices found!' } }
    else if (!deviceMdm) result = { status: 406, send: { deviceRxart, deviceMdm: null, lastLocation: null } }
    else result = { status: 200, send: { deviceRxart, deviceMdm, lastLocation } }

    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_QUERY_SEARCH_DEVICES')
  }
}

const setDeviceData = async (req, res) => {
  try {
    const result = await setDevices(req)
    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_SET_DEVICE_DATA')
  }
}

const obtainLastTicket = async (req, res) => {
  try {
    const result = await getLastTicket(req)
    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_LAST_TICKET')
  }
}

const calculateTicket = async (req, res) => {
  try {
    const result = await calculateUnlockCode(req)
    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_CALC_TICKET')
  }
}

const changeDeviceStatus = async (req, res) => {
  try {
    const result = await updateStatus(req)
    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_CHANGE_DEVICE_STATUS')
  }
}

const queryPreferencesClient = async (req, res) => {
  try {
    const result = await getPreferencesClient(req)
    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_QUERY_PREFERENCES_CLIENT')
  }
}

const changePreferencesClient = async (req, res) => {
  try {
    const result = await updatePreferencesClient(req)
    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_CHANGE_PREFERENCES_CLIENT')
  }
}

const queryPreferencesDevice = async (req, res) => {
  try {
    const result = await getPreferencesDevice(req)
    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_QUERY_PREFERENCES_DEVICE')
  }
}

const changePreferencesDevice = async (req, res) => {
  try {
    const result = await updatePreferencesDevice(req)
    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_CHANGE_PREFERENCES_DEVICE')
  }
}

const queryProject = async (req, res) => {
  try {
    const result = await getProject(req)
    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_QUERY_PROJECT')
  }
}

const changePreferencesProject = async (req, res) => {
  try {
    const result = await updatePreferencesProject(req)
    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_CHANGE_PREFERENCES_PROJECT')
  }
}

const preferences = async (req, res) => {
  try {
    let response
    if (req.method === 'PUT') response = await updatePreferences(req)
    // else if (req.method === 'DELETE') response = await DeleteUsers(req)
    else response = await getPreferences(req)
    res.status(response.status).send(response.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_PREFERENCES')
  }
}

const licenseActivation = async (req, res) => {
  try {
    const result = await registerLicenseDevice(req)
    res.status(result.status).send(result.send).end()
  } catch (error) {
    throwAppError(error, 'ERR_LICENSE_ACTIVATION')
  }
}

module.exports = {
  countDevices,
  queryDevices,
  queryDevicesPixtech,
  querySearchDevices,
  setDeviceData,
  obtainLastTicket,
  calculateTicket,
  changeDeviceStatus,
  queryPreferencesClient,
  changePreferencesClient,
  queryPreferencesDevice,
  changePreferencesDevice,
  queryProject,
  changePreferencesProject,
  preferences,
  licenseActivation
}
