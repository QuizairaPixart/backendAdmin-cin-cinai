const { SequelizeError } = require('../../middlewares/errors/AppError')
const { applications } = require('../../models/Psql/ApplicationsModel')
const { Op } = require('sequelize')

const createApp = async (data) => {
  try {
    let application
    if (data) {
      application = await applications.create(data)
      if (application instanceof applications) {
        console.log(`aplicacion ${application.id} creado con exito!  `)
      }
    }
    return application
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readApp = async (id, tables = null/* , pagination = null */) => {
  try {
    let application
    if (id) {
      application = await applications.findOne({
        where: id,
        include: tables
      })
    } else {
      application = await applications.findAll({ include: tables })
    }
    return application
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readAppsWithPagination = async (groupApp = null, date = null, order = null, limit = null, offset = null, search = null, column = null) => {
  try {
    // console.log(date)
    let apps = null
    const filter = []
    let where = null
    const orderOfQuery = order ? [order, ['id']] : null

    if (groupApp) filter.push(groupApp)
    if (search) filter.push([column || 'app', { [Op.iLike]: `%${search}%` }])
    if (date) filter.push(['last_date', { [Op.between]: date }])
    if (filter.length > 0) where = Object.fromEntries(filter)

    apps = await applications.findAndCountAll({
      where,
      order: orderOfQuery,
      offset,
      limit,
      distinct: true
    })

    // console.log(apps)

    return apps
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readAppsWithOutPagination = async (groupApp = null, date = null, search = null, column = null) => {
  try {
    let apps = null
    const filter = []
    let where = null

    if (groupApp) filter.push(groupApp)
    if (search) filter.push([column || 'app', { [Op.iLike]: `%${search}%` }])
    if (date) filter.push(['last_date', { [Op.between]: date }])
    if (filter.length > 0) where = Object.fromEntries(filter)

    apps = await applications.findAll({
      where
    })

    return apps
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readAppForGroupApp = async (groupApp) => {
  try {
    let application = null

    application = await applications.findAll({
      where: { groupApp }
    })

    return application
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readUseTimeAppsForGroupApp = async (where = null, date = null) => {
  // console.log(date)
  try {
    let apps = null

    if (date) {
      apps = await applications.findAll(
        {
          where,
          include: {
            association: 'allAppUseMetrics',
            required: true,
            where: {
              date: { [Op.between]: date }
            }
          },
          order: [['allAppUseMetrics', 'totalTimeSeconds', 'DESC']]
        }
      )
    } else {
      apps = await applications.findAll(
        {
          where,
          include: {
            association: 'allAppUseMetrics',
            required: true
          },
          order: [['allAppUseMetrics', 'totalTimeSeconds', 'DESC']]
        }
      )
    }

    return apps
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateApp = async (id, data, tables) => {
  try {
    const application = await applications.update(data, { where: { id } })
    return application
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const deleteApp = async (id) => {
  try {
    const application = await readApp(id)
    if (application != null) {
      return await application.destroy()
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
const createDefaultApps = async (list) => {
  try {
    const appsDefault = list.map((app) => {
      const appRow = {
        package: app,
        groupApp: 0,
        app: 'default:' + app,
        system: true,
        last_date: new Date()
      }
      return appRow
    })
    return await applications.bulkCreate(appsDefault, {
      ignoreDuplicates: true
    })
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
  createApp,
  readApp,
  readAppForGroupApp,
  readUseTimeAppsForGroupApp,
  readAppsWithPagination,
  readAppsWithOutPagination,
  updateApp,
  deleteApp,
  createDefaultApps
}
