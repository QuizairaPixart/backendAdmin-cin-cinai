const { SequelizeError } = require('../../middlewares/errors/AppError')
const { logs } = require('../../models/Psql/LogsModel')
const { devices, connections } = require('../../models/Psql/DeviceModel')
const { Op } = require('sequelize')

// read devices
const readDevice = async (id = null, table = 'groups', pagination = null) => {
  try {
    let device
    // let date
    if (id) {
      if (table) {
        device = await devices.findOne({
          where: id,
          include: table
        })
      } else {
        device = await devices.findOne({
          where: id
        })
      }
    } else if (pagination) {
      if (pagination.like !== null) {
        const arrayObject = new Map([
          [pagination.column, { [Op.iLike]: `%${pagination.like}%` }]
        ])
        const where = Object.fromEntries(arrayObject)
        // console.log({ where });
        device = await devices.findAndCountAll({
          where,
          include: table,
          order: [pagination.order, ['id']],
          offset: pagination.offset,
          limit: pagination.limit,
          distinct: true
        })
      } else if (pagination.include) {
        if (pagination.reports) {
          const arrayObject = new Map([
            ['last_date', { [Op.gte]: pagination.include }]
          ])
          const where = Object.fromEntries(arrayObject)
          // console.log({ where });
          device = await devices.findAll({
            where,
            include: table
          })
        } else {
          const arrayObject = new Map([
            ['last_date', { [Op.gte]: pagination.include }]
          ])
          const where = Object.fromEntries(arrayObject)
          // console.log({ where });
          device = await devices.findAndCountAll({
            where,
            include: table,
            order: [pagination.order, ['id']],
            offset: pagination.offset,
            limit: pagination.limit,
            distinct: true
          })
        }
      } else {
        device = await devices.findAndCountAll({
          where: pagination.like,
          include: table,
          order: [pagination.order, ['id']],
          offset: pagination.offset,
          limit: pagination.limit,
          distinct: true
        })
      }
    } else {
      device = await devices.findAll({
        include: table
      })
    }
    return device
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read devices locations reports
const readDevicesLocationsReports = async (dateFilter = null) => {
  try {
    const include = {
      association: 'locations',
      order: [['date', 'DESC']],
      limit: 1
    }

    if (dateFilter !== null && dateFilter !== 0) {
      const endDate = new Date()
      let startDate = new Date()
      startDate = startDate.setDate(startDate.getDate() - dateFilter)
      include.where = { date: { [Op.between]: [startDate, endDate] } }
    }

    const devicesDB = (await devices.findAll({ include })).filter((res) => res?.locations?.length > 0)

    return devicesDB
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// Update devices
const updateDevice = async (id, data, table) => {
  try {
    delete data?.last_date
    const device = await devices.update(data, { where: id, ...table })
    return device
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// delete devices
const deleteDevice = async (id) => {
  try {
    const device = devices.destroy({ where: id })
    if (device) {
      return { result: true }
    }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const createDevicesAndSerial = async (data) => {
  try {
    const [device] = await Promise.all([
      data.map((element) => {
        element.identity = element.serial_number
        element.connectionId = 1
        return element
      })
    ])

    const factor = device.length / 3
    const bulkDevice1 = device.splice(0, factor)
    const bulkDevice2 = device.splice(0, factor)
    const bulkDevice3 = device.splice(0, device.length)
    await connections.create({
      date: new Date('2023-01-10 10:23:50.29-03')
    })
    devices.bulkCreate(bulkDevice1).then((res) => {
      console.log('primer parte ok', res.length)
      devices.bulkCreate(bulkDevice2).then((res) => {
        console.log('segunda parte ok', res.length)
        devices.bulkCreate(bulkDevice3).then((res) => {
          console.log('tercer parte ok', res.length)
        })
      })
    })

    return true
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readDates = async () => {
  try {
    let startDate = new Date()
    startDate = startDate.setDate(startDate.getDate() - 7)

    const endDate = new Date()
    const total = devices.count()

    const connectionDB = devices.count({
      where: { last_date: { [Op.between]: [startDate, endDate] } }
    })

    const desconnected = await total - await connectionDB

    return { total: await total, connected: await connectionDB, desconnected }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readMissingDevices = async () => {
  try {
    const total = devices.count()

    const missingDevicesDB = devices.count({
      where: { missing: true }
    })

    const notMissing = await total - await missingDevicesDB

    return { total: await total, missing: await missingDevicesDB, notMissing }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readAppsDevices = async (id, table) => {
  try {
    let device
    let applications

    if (table && id) {
      device = await devices.findOne({
        where: { id },
        include: table
      })
    }

    if (device) applications = device.applications

    return applications || []
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read error logs
const readLog = async (id, table = null) => {
  try {
    let log
    if (id) {
      log = await logs.findAll({
        where: id,
        include: table
      })
    } else {
      log = await logs.findAll({ include: table })
    }
    return log
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

module.exports = {
  readDates,
  readDevice,
  readDevicesLocationsReports,
  readAppsDevices,
  readMissingDevices,
  updateDevice,
  deleteDevice,
  createDevicesAndSerial,
  readLog
}
