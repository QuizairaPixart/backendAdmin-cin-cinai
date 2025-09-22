const { SequelizeError } = require('../../middlewares/errors/AppError')
const { leases } = require('../../models/Psql/LeasesModel')

const createLease = async (data) => {
  try {
    const lease = await leases.create(data)
    console.log(`lease ${lease.id} creado con exito`)
    return lease
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readLease = async (id, table = null) => {
  try {
    let lease
    if (id) {
      lease = await leases.findOne({
        where: id
      })
    }
    return lease
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const deleteLease = async (id) => {
  try {
    const lease = await leases.destroy({ where: id })

    if (lease) {
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

const updateLease = async (id, data) => {
  try {
    const lease = await leases.update(data, {
      where: id,
      returning: true
    })

    if (lease) return { result: true, lease: lease[1][0] }
    return { result: false }
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
  readLease,
  createLease,
  deleteLease,
  updateLease
}
