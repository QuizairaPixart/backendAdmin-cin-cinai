const { readCommands, createCommand, updateCommand, removeCommand, readLastCommand } = require('../../Databases/CRUD-Commands')

const getCommands = async id => {
  const commands = await readCommands(id)
  if (commands) return commands
}
const postCommands = async data => {
  if (data?.id) {
    const existCommand = await readCommands(data.id)
    if (existCommand) return { result: false }
  }

  const command = await createCommand(data)
  if (command) return command
}
const putCommands = async (id, data) => {
  const command = await updateCommand(id, data)
  if (command) return command
}
const deleteCommands = async id => {
  const command = await removeCommand(id)
  if (command) return command
}
const lastCommands = async id => {
  const commands = await readLastCommand(id)
  if (commands) return commands
}

module.exports = {
  getCommands,
  postCommands,
  putCommands,
  deleteCommands,
  lastCommands
}
