const { RxartSecure } = require('../../../config')
const { readServerPreference } = require('../../Databases/CRUD-Preferences')
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))
let url = RxartSecure.URL
let apiKey = RxartSecure.APIKEY
let clientId = RxartSecure.CLIENTID

const getServerPreferences = async () => {
  try {
    const serverPreferencesDB = await readServerPreference(1)
    url = serverPreferencesDB.Rxart_Secure[0]
    apiKey = serverPreferencesDB.Rxart_Secure[1]
    clientId = serverPreferencesDB.Rxart_Secure[2]
  } catch (error) {
    console.log('error en la BD serverpref con cuco')
  }
}
const Authorization = async (APIKEY) => {
  const auth = 'Basic ' + Buffer.from(APIKEY + ': ').toString('base64')

  return auth
}
// todo RxartSecure

const QueryDevice = async (body, res = { status: 500, result: false }) => {
  await getServerPreferences()
  const headers = new Headers()
  const params = `?action=query_devices&deviceid=${body.id_rxart}`

  headers.append('Authorization', await Authorization(apiKey))

  const request = await fetch(url + params, {
    method: 'GET',
    headers
  })

  const response = await request.json()
  res.status = request.status
  res.send = response
  return res
}
const CalcTicket = async (body, res = { status: 500, result: false }) => {
  await getServerPreferences()

  const headers = new Headers()
  const params = `?action=query_calc_unlock_code&deviceid=${body.id_rxart}&ct=${body.ct}&uc=${body.uc}`

  headers.append('Authorization', await Authorization(apiKey))

  const request = await fetch(url + params, {
    method: 'GET',
    headers
  })
  const response = await request.json()
  res.status = request.status
  res.send = response
  return res
}
const ChangeStatusDevice = async (body, res = { status: 500, result: false }) => {
  await getServerPreferences()

  const headers = new Headers()
  const params = `?action=change_device_status&deviceid=${body.id_rxart}&newstatus=${body.newStatus}&info=${body.info}&serial=${body.serialBios}`

  headers.append('Authorization', await Authorization(apiKey))

  const request = await fetch(url + params, {
    method: 'GET',
    headers
  })
  const response = await request.json()
  res.status = request.status
  res.send = response
  return res
}
const changeDeviceData = async (body, res = { status: 500, result: false }) => {
  // console.log({ datarxart: body });
  await getServerPreferences()

  const headers = new Headers()
  let serial = ''
  let description = ''
  if (body.newSerial) { serial = `&newserial=${body.newSerial}` }
  if (body.newDescription) { description = `&newdescription=${body.newDescription}` }

  const params = `?action=change_device_data&deviceid=${body.id_rxart}&serial=${body.serialBios}${serial}${description}`

  headers.append('Authorization', await Authorization(apiKey))

  const request = await fetch(url + params, {
    method: 'GET',
    headers
  })
  const response = await request.json()
  res.status = request.status
  res.send = response
  return res
}
const ChangeClientData = async (body, res = { status: 500, result: false }) => {
  await getServerPreferences()

  const headers = new Headers()
  let iniTimeOut = ''
  let lastDate = ''
  let tolerance = ''
  let maxBoots = ''
  let fInterval = ''
  let msgIT = ''
  let msgBW = ''
  let msgBT = ''
  if (body.newIniTimeOut) { iniTimeOut = `&newinitimeout=${body.newIniTimeOut}` }
  if (body.newLastDate) { lastDate = `&newlastdate=${body.newLastDate}` }
  if (body.newTolerance) { tolerance = `&newtolerance=${body.newTolerance}` }
  if (body.newMaxBoots) { maxBoots = `&newmaxboots=${body.newMaxBoots}` }
  if (body.newFInterval) { fInterval = `&newfinterval=${body.newFInterval}` }
  if (body.newMsgIT) { msgIT = `&newmsgIT=${body.newMsgIT}` }
  if (body.newMsgBW) { msgBW = `&newmsgBW=${body.newMsgBW}` }
  if (body.newMsgBT) { msgBT = `&newmsgBT=${body.newMsgBT}` }

  const params = `?action=change_client_data&clientid=${clientId}${iniTimeOut}${lastDate}${tolerance}${maxBoots}${fInterval}${msgIT}${msgBW}${msgBT}`

  headers.append('Authorization', await Authorization(apiKey))

  const request = await fetch(url + params, {
    method: 'GET',
    headers
  })
  const response = await request.json()
  res.status = request.status
  res.send = response
  return res
}

const QueryClientData = async (body, res = { status: 500, result: false }) => {
  await getServerPreferences()

  const headers = new Headers()
  const params = `?action=query_client_data&clientid=${clientId}`

  headers.append('Authorization', await Authorization(apiKey))

  const request = await fetch(url + params, {
    method: 'GET',
    headers
  })
  const response = await request.json()
  res.status = request.status
  res.send = response
  return res
}
// ? testeo que la API funcione al inciar el Rxart
const TestRxart = async (req, res = { status: 500, result: false }) => {
  try {
    await getServerPreferences()
    // console.log({ url, apiKey, clientId })
    const headers = new Headers()

    headers.append('Authorization', await Authorization(apiKey))
    const request = await fetch(url, {
      method: 'GET',
      headers
    })
    if (request.status !== 200) throw Error(`${request.status} => ${request.statusText}`)
    const response = await request.json()
    if (response.error) console.info('credenciales CuCo Correctas')
  } catch (error) {
    console.info('problemas con la API CuCo', { error })
  }
}
TestRxart()
module.exports = { QueryDevice, CalcTicket, ChangeStatusDevice, changeDeviceData, ChangeClientData, QueryClientData }
