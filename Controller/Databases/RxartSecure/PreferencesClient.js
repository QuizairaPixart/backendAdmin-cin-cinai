const { SequelizeError } = require('../../../middlewares/errors/AppError')
const { preferencesClient } = require('../../../models/Rxart/PreferenceClientModel')
const { rxartPrefClient } = require('../../../utils/rxartPrefClient.json')

const getRxartClients = async (id = null) => {
  try {
    let prefClient
    if (!id) prefClient = await preferencesClient.findAll()
    prefClient = await preferencesClient.findOne({ where: { id } })
    return prefClient?.toJSON()
  } catch (error) {
    throw new SequelizeError(
      error.name,
      error.original ? error.original.routine + ' => ' + error.message : error.message,
      error.statusCode || 500,
      error.sql
    )
  }
}

const setRxartPrefClients = async (id = null, data) => {
  try {
    if (!data) return null
    if (id) data.id = id

    const [prefClient, created] = await preferencesClient.upsert(data, { returning: true })
    console.log(`Rxart Preference Client ${prefClient.id} ${created ? 'created' : 'updated'} with success!`)

    return prefClient?.toJSON()
  } catch (error) {
    throw new SequelizeError(
      error.name,
      error.original ? error.original.routine + ' => ' + error.message : error.message,
      error.statusCode || 500,
      error.sql
    )
  }
}

const getOrCreatePreferenceClient = async (id = null) => {
  let prefClient = await getRxartClients(id)
  if (!prefClient) prefClient = await setRxartPrefClients(null, rxartPrefClient)
  return prefClient
}

module.exports = {
  getRxartClients,
  setRxartPrefClients,
  getOrCreatePreferenceClient
}
