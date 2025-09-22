const { preferences, serverPreferences, useTimes } = require('../../models/Psql/PreferenceModel.js')
const { defaultThief } = require('../../models/Psql/DefaultThiefModel')
const { preferencesReports } = require('../../models/Psql/ReportsModel.js')
const { SequelizeError } = require('../../middlewares/errors/AppError.js')

// PREFERENCES//---------------------
// create preferences
const createPreference = async (data) => {
  try {
    let preference
    if (data) {
      preference = await preferences.create(data, { returning: true })
      if (preference instanceof preferences) {
        console.log(`preferencia ${preference.id} creada con exito!  `)
      }
    }
    return preference
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read preferences
const readPreference = async (id, table = null) => {
  try {
    let preference
    if (id !== null) {
      preference = await preferences.findOne({
        where: id,
        include: table
      })
    } else {
      preference = await preferences.findAll(id, table)
    }
    return preference
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// update preferences
const updatePreference = async (id, data) => {
  try {
    const preference = await preferences.update(data, {
      where: id,
      returning: true
    })

    return preference
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// delete preferences
const deletePreference = async (id) => {
  try {
    const preference = preferences.destroy({ where: id })
    if (preference) {
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

// SERVER PREFERENCES//---------------------
// create server preferences
const createServerPreference = async (data) => {
  try {
    let preference
    if (data) {
      if (data?.url_secondary?.length > 0) {
        if (!(data.url_secondary.includes('http://') || data.url_secondary.includes('https://')))data.url_secondary = ''
      } else {
        data.url_secondary = ''
      }
      preference = await serverPreferences.create(data)
      if (preference instanceof serverPreferences) {
        console.log(`server preference ${preference.id} creada con exito!  `)
      }
    }
    return preference
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read preferences
const readServerPreference = async (id, table = null) => {
  try {
    let preference
    if (id !== null) {
      preference = await serverPreferences.findOne({
        where: id,
        include: table
      })
    } else {
      preference = await serverPreferences.findAll(id, table)
    }
    return preference
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// update preferences
const updateServerPreference = async (id, data) => {
  try {
    let preference
    // console.log(data)
    if (data) {
      if (data?.url_secondary?.length > 0) {
        if (!(data.url_secondary.includes('http://') || data.url_secondary.includes('https://')))data.url_secondary = ''
      } else {
        data.url_secondary = ''
      }
      preference = await serverPreferences.update(data, { where: id })
    }
    return preference
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// delete preferences
const deleteServerPreference = async (id) => {
  try {
    const preference = serverPreferences.destroy({ where: id })
    if (preference) {
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

// USE TIMES//---------------------
// create use time
const createUseTime = async (data) => {
  try {
    let useTime
    if (data) {
      useTime = await useTimes.create(data, { returning: true })
      if (useTime instanceof useTimes) {
        console.log(`use time ${useTime.id} creada con exito!  `)
      }
    }
    return useTime
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read use time
const readUseTime = async (id, table = null) => {
  try {
    let useTime
    if (id !== null) {
      useTime = await useTimes.findOne({
        where: id,
        include: table
      })
    } else useTime = await useTimes.findAll(id, table)
    return useTime
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// update use time
const updateUseTime = async (id, data) => {
  try {
    const useTime = await useTimes.update(data, { where: id })
    return useTime
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// delete use time
const deleteUseTime = async (id) => {
  try {
    const useTime = useTimes.destroy({ where: id })
    if (useTime) {
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

// DEFAULT THIEFuseTimeS//---------------------
// create defaultthief
const createDefaultThief = async (data) => {
  try {
    let defThief
    if (data) {
      defThief = await defaultThief.create(data)
      if (defThief instanceof defaultThief) {
        console.log(`defThief ${defThief.id} creada con exito!  `)
      }
    }
    return defThief
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read DefaultThief
const readDefaultThief = async (id) => {
  try {
    let defThief
    if (id) {
      defThief = await defaultThief.findOne({
        where: id
      })
    } else {
      defThief = await defaultThief.findAll()
    }
    return defThief
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// update preferences
const updateDefaultThief = async (id, table, data) => {
  try {
    let defThief = await readDefaultThief(id)
    if (defThief != null) {
      defThief = Object.assign(defThief, data)
      defThief.save()
    }

    return defThief
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// delete preferences
const deleteDefaultThief = async (id) => {
  try {
    const thief = defaultThief.destroy({ where: id })
    if (thief) {
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

// REPORTS PREFERENCES//---------------------
// create Reports
const createReports = async (data) => {
  try {
    let report
    if (data) {
      report = await preferencesReports.create(data)
      if (report instanceof preferencesReports) {
        console.log(`report ${report.id} creada con exito!  `)
      }
    }
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

// read Reports
const readReports = async (id, table) => {
  try {
    let report
    if (table) {
      report = await preferencesReports.findOne({
        where: id,
        include: table
      })
    } else {
      report = await preferences.findOne({
        where: id,
        include: [preferencesReports]
      })
      report = report?.preferencesReport
    }

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

// update Reports
const updateReports = async (id, table, data) => {
  try {
    let report = await readReports(id, table)
    if (report != null) {
      report = Object.assign(report, data)
      report.save()
    }

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

// delete Reports
const deleteReports = async (id) => {
  try {
    const report = preferencesReports.destroy({ where: id })
    if (report) {
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

module.exports = {
  createPreference,
  readPreference,
  updatePreference,
  deletePreference,
  createServerPreference,
  readServerPreference,
  updateServerPreference,
  deleteServerPreference,
  createUseTime,
  readUseTime,
  updateUseTime,
  deleteUseTime,
  createDefaultThief,
  readDefaultThief,
  updateDefaultThief,
  deleteDefaultThief,
  createReports,
  readReports,
  updateReports,
  deleteReports
}
