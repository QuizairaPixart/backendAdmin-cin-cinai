const { SequelizeError } = require('../../../middlewares/errors/AppError')
const { devices } = require('../../../models/Rxart/DeviceModel')

const getTotalRxartDevices = async () => {
  try {
    const total = await devices.findAndCountAll()
    return total
  } catch (error) {
    throw new SequelizeError(
      error.name,
      error.original ? error.original.routine + ' => ' + error.message : error.message,
      error.statusCode || 500,
      error.sql
    )
  }
}

const getRxartDevices = async (filters = {}) => {
  try {
    let device

    if (!Object.keys(filters).length) {
      device = await devices.findAll()
      return device.map(dev => dev.toJSON())
    }

    device = await devices.findOne({ where: filters })
    return device?.toJSON()
  } catch (error) {
    throw new SequelizeError(
      error.name,
      error.original ? error.original.routine + ' => ' + error.message : error.message,
      error.statusCode || 500,
      error.sql
    )
  }
}

const setRxartDevice = async (data) => {
  try {
    if (!data) return null

    const device = await devices.create(data)
    if (device instanceof devices) console.log(`Rxart Device ${device.id} created with success!`)

    return device
  } catch (error) {
    throw new SequelizeError(
      error.name,
      error.original ? error.original.routine + ' => ' + error.message : error.message,
      error.statusCode || 500,
      error.sql
    )
  }
}

const updateRxartDevice = async (deviceId, data) => {
  try {
    const [, updatedDevices] = await devices.update(data, {
      where: { deviceId },
      returning: true
    })

    return updatedDevices
  } catch (error) {
    throw new SequelizeError(
      error.name,
      error.original ? error.original.routine + ' => ' + error.message : error.message,
      error.statusCode || 500,
      error.sql
    )
  }
}

const getOrCreateRxartDevice = async (data) => {
  try {
    const findKey = data?.deviceId ? { deviceId: data?.deviceId } : data?.serialBios ? { serialBios: data?.serialBios } : { id: data?.id }
    const device = await getRxartDevices(findKey)
    if (device) return device
    return await setRxartDevice(data)
  } catch (error) {
    throw new SequelizeError(
      error.name,
      error.original ? error.original.routine + ' => ' + error.message : error.message,
      error.statusCode || 500,
      error.sql
    )
  }
}

module.exports = {
  getTotalRxartDevices,
  getRxartDevices,
  setRxartDevice,
  updateRxartDevice,
  getOrCreateRxartDevice
}
