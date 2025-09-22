const { createMissingDevice, readMissingDevice, updateMissingDevice, readMissingDevices } = require('../../Databases/CRUD-MissingDevices')

const GetMissingDevices = async (req, res = { status: 500, send: { auth: false } }) => {
  const { statusFilter } = JSON.parse(req?.params?.statusFilter)

  const missingDevicesDB = statusFilter === 'all' ? await readMissingDevices(null) : await readMissingDevices({ status: statusFilter })

  if (missingDevicesDB) {
    res.status = 200
    res.send = missingDevicesDB
  }

  return res
}

const PostMissingDevices = async (req, res = { status: 500, send: { auth: false } }) => {
  const missingDevices = await createMissingDevice(req?.body)

  if (missingDevices) {
    res.status = 201
    res.send = missingDevices
  }
  return res
}

const PutMissingDevices = async (req, res = { status: 500, send: { auth: false } }) => {
  const { body } = req
  const { deviceId } = body

  const missingDeviceDB = await readMissingDevice({ deviceId })

  if (!missingDeviceDB) {
    res.status = 400
    res.send = { result: false }
    return res
  }

  const missingDevice = await updateMissingDevice({ deviceId }, body)
  if (missingDevice?.result) {
    res.status = 201
    res.send = missingDevice
  }
  return res
}

module.exports = {
  GetMissingDevices,
  PostMissingDevices,
  PutMissingDevices
}
