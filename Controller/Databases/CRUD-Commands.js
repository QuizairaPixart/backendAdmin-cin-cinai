const { SequelizeError } = require('../../middlewares/errors/AppError')
const { commands } = require('../../models/Psql/CommandsModel')

const readCommands = async (id) => {
  try {
    let command
    if (!id) command = await commands.findAll()
    else command = await commands.findOne({ where: id })
    return command
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const createCommand = async (data) => {
  try {
    if (data) {
      const command = await commands.create(data)
      if (command instanceof commands) return { result: true, command }
      return { result: false }
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

const updateCommand = async (id, data) => {
  try {
    const command = await commands.update(data, {
      where: id,
      returning: true
    })
    if (command) return { result: true, command }
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

const removeCommand = async (id) => {
  try {
    const command = await commands.destroy({ where: id })
    if (command) return { result: true }
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

const readLastCommand = async (deviceId) => {
  try {
    const command = await commands.findAll(
      {
        order: [['dateCommand', 'DESC']],
        limit: 3
      },
      {
        where: deviceId
      }
    )
    return command
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
  readCommands,
  createCommand,
  updateCommand,
  removeCommand,
  readLastCommand
}
