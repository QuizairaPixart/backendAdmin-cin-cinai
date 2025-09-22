const { SequelizeError } = require('../../middlewares/errors/AppError')
const { stats, allStatsMetrics } = require('../../models/Psql/StatsModel')

const createStats = async (data) => {
  try {
    let stat
    data.Ram = JSON.stringify([data.Ram])
    data.Disk = JSON.stringify([data.Disk])

    if (data) {
      stat = await stats.create(data)
      if (stat instanceof stats) {
        console.log(`status ${stat.id} creado con exito!  `)
      }
    }
    return stat
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readStats = async (id, tables) => {
  try {
    let stat
    if (id != null && id !== 'stats-device-report') {
      stat = await stats.findOne({
        where: id,
        include: tables
      })
    } else if (id != null && id === 'stats-device-report') {
      stat = await stats.findAll({
        include: tables
      })
    } else {
      stat = await stats.findAll({
        limit: 18000
      })
    }
    return stat
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readStatsMetrics = async (date) => {
  try {
    let stats
    if (!date) {
      stats = await allStatsMetrics.findAll()
      return stats
    }
    stats = await allStatsMetrics.findOne({ where: date })
    return stats
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateStats = async (id, data, tables) => {
  try {
    const stat = await stats.update(data, {
      where: {
        id,
        ...tables
      }
    })
    return stat
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const deleteStats = async (id) => {
  try {
    const stat = await readStats(id)
    if (stat != null) {
      return await stat.destroy()
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
  createStats,
  readStats,
  readStatsMetrics,
  updateStats,
  deleteStats
}
