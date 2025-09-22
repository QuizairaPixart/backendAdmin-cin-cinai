const { getCommands, postCommands, putCommands, deleteCommands, lastCommands } = require('../Actions/CommandsCtrl')

const GetCommand = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const id = +req?.params?.id
  const command = await getCommands(id)
  if (command) {
    response.status = 200
    response.send = command
  }
  return response
}
const PostCommand = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const command = await postCommands(req?.body)

  if (command.result === false || command.result === null) {
    response.status = 400
    response.send = command
  } else {
    response.status = 201
    response.send = { result: command.result, commands: command?.command?.toJSON() }
    req.locals = { commands: command?.command?.toJSON() }
  }
  return response
}

const PutCommand = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const { body } = req
  const id = +body?.id

  const existingCommand = await getCommands(id)

  if (!existingCommand) {
    response.status = 400
    response.send = { result: false }
    return response
  }

  const command = await putCommands({ id }, body)

  if (command) {
    response.status = 200
    response.send = { result: command.result }
    req.locals = { commands: command?.command[1][0]?.toJSON() }
  }
  return response
}

const DeleteCommand = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const id = +req?.params?.id
  const command = await deleteCommands({ id })
  if (command) {
    response.status = 201
    response.send = command
  }
  return response
}

const GetLastCommands = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const id = +req?.params?.id
  const commands = await lastCommands(id)
  if (commands) {
    response.status = 200
    response.send = commands
  }
  return response
}

module.exports = {
  GetCommand,
  PostCommand,
  PutCommand,
  DeleteCommand,
  GetLastCommands
}
