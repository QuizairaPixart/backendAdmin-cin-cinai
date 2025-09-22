const { createDenunciation, readDenunciation, readDenunciations, updateDenunciation } = require('../../Databases/CRUD-Denunciations')
const { updateLossReportWithDenunciation } = require('../../Databases/CRUD-LossReport')

const getDenunciation = async (id) => {
  let denunciation = []
  const res = await readDenunciation(id)
  if (res) denunciation = res

  return denunciation
}
const getDenunciations = async (filter = null) => {
  let denunciations = []
  const res = await readDenunciations(filter)
  if (res) denunciations = res

  return denunciations
}
const postDenunciation = async (data) => {
  const { orderId } = data
  delete data.orderId

  const denunciation = await createDenunciation(data)

  if (denunciation) {
    const report = await updateLossReportWithDenunciation(denunciation?.id, orderId, denunciation?.deviceId)
    if (report?.length > 0) {
      report.forEach(item => {
        console.log(`reportLoss ${item?.id} actualizado con éxito`)
      })
    }
  }

  return denunciation
}

const putDenunciation = async (id, data) => {
  const denunciation = await updateDenunciation(id, data)

  if (denunciation) return denunciation
}

// const deleteCommands = async id => {
//   const command = await removeCommand(id)
//   if (command) return command
// }
// const lastCommands = async id => {
//   const commands = await readLastCommand(id)
//   if (commands) return commands
// }

module.exports = {
  postDenunciation,
  getDenunciation,
  getDenunciations,
  putDenunciation
}
