const { GetDenunciations } = require('./DenunciationsCtrl')
const { GetDeviceLastLocationReports, GetDevices } = require('./DevicesCtrl')
const { GetMissingDevices } = require('./MissingDevicesCtrl')

const GetReports = async (req, res = { status: 500, send: { auth: false } }) => {
  let devices
  if (req?.params?.dateFilter) {
    devices = await GetDeviceLastLocationReports(req)
  } else if (req?.params?.statusFilter) {
    if (req.path.includes('missing-devices-report')) devices = await GetMissingDevices(req)
    if (req.path.includes('reported-devices-report')) devices = await GetDenunciations(req)
  } else if (req.path.includes('devices')) {
    devices = await GetDevices(req)
  }

  if (devices) {
    res.status = 200
    res.send = devices.send
  }

  return res
}

module.exports = {
  GetReports
}
