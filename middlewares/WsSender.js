const { readAction } = require('../Controller/Databases/CRUD-Actions')
const { getGeofencesOfDevices } = require('../Controller/Databases/CRUD-Client')
const { readPreference } = require('../Controller/Databases/CRUD-Preferences')
const { readPreference: readPreferenceSFW } = require('../Controller/Databases/CRUD-SafeWeb')
const { sendRedis } = require('../Controller/WsController/RedisController')
const { redisClientPub, redisClientSub } = require('../db/db')
const { devices } = require('../models/Psql/DeviceModel')
const { groups } = require('../models/Psql/GroupsModel')

// ? Envio de Acciones a traves de WS
const SendActions = async (req, res) => {
  redisClientSub.subscribe('channel-ws-2', (err, count) => {
    if (err) console.log({ err })
    else console.log('suscrito a channel-ws-2')
  })
  const ids = req.locals.id
  const actionsDB = await readAction({ id: ids }, ['groups', 'devices'])
  const actions = actionsDB.map(action => {
    return {
      id: action.id,
      action: action.action,
      data: action.data,
      groupsId: action.groups.map((group) => group.id),
      licences: action.devices.map(device => device.licence)
    }
  })
  let response = []
  // ? agregar las licences a la accion en caso de que el grupo sea distinto a 1
  const sendAction = []
  for (const action of actions) {
    if (action.groupsId.filter(groupId => groupId !== 1).length > 0) {
      let licencesGroup = [...action.licences, ...(await RouterAction(action))]
      licencesGroup = new Set(licencesGroup)
      const arrayLicencesGroup = Array.from(licencesGroup)
      // console.log(arrayLicencesGroup)
      action.licences = arrayLicencesGroup
    }
    if (action.action === 'uninstall') {
      const pathUninstall = action.data.uninstall
      if (pathUninstall.includes(':/') || pathUninstall.includes('.exe') || pathUninstall.includes(':*')) {
        action.licences = action.licences.filter((licence) => licence.includes('-W'))
      } else {
        action.licences = action.licences.filter((licence) => !licence.includes('-W'))
      }
    } else if (action.action === 'install' && action.data.type === 'app') {
      const urlSplit = action.data.url.split('/')
      const extension = urlSplit[urlSplit.length - 1]
      if (extension === 'apk') {
        action.licences = action.licences.filter((licence) => !licence.includes('-W'))
      } else if (extension === 'exe' || extension === 'msi') {
        action.licences = action.licences.filter((licence) => licence.includes('-W'))
      }
    }
    sendAction.push(action)
  }
  // actions.forEach(async (action, index) => {
  //   const result = { result: true, sendings: [] }
  //   if (parseInt(action.groupsId[0]) !== 1) {
  //     action.licences = await RouterAction(action)
  //     action.groupsId = []
  //   }
  //   action.id = ids[index]
  if (!req.noSend) {
    sendRedis('channel-ws-1', { connection: { actions: sendAction } })
    const result = { result: true, sendings: [] }
    redisClientSub.on('message', (ch, mess) => {
      if (ch === 'channel-ws-2') {
        const data = JSON.parse(mess)
        if (data?.result === true) {
          result.sendings =
            result.sendings.length === 0
              ? data.sendings
              : [...result.sendings, ...data.sendings]
        }

        response.push(result)
      }
    })
    setTimeout(() => {
      if (response.length === 0 || !Array.isArray(response)) { response = [{ result: true, sendings: [] }] }
      res.status(200).send(response)
      response = []
    }, 2000)
  } else {
    return sendAction
  }
}

const RouterAction = async (action) => {
  let identitys = []
  let devicesDB = []
  let groupsDB = []
  if (action?.devicesId?.length > 0) {
    devicesDB = await devices.findAll({ where: { id: action.devicesId } })
    identitys = devicesDB.map((device) => device.licence)
  } else if (action?.groupsId?.length > 0) {
    groupsDB = await groups.findAll({
      where: { id: action.groupsId },
      include: 'devices'
    })
  }
  for (const group of groupsDB) {
    devicesDB = [...devicesDB, ...group.devices]
  }
  if (devicesDB.length !== 0) { identitys = devicesDB.map((device) => device.licence) }
  return identitys
}

// ? Envio de Preferencias a todos lo equipos
const SendPreferences = async (req, res) => {
  let prefId = req?.locals?.preference ? req.locals.preference.id : 1
  const sfwbPrefId = req?.locals?.sfwbPreference ? req.locals.sfwbPreference.id : 1

  const SafeWebPref = await readPreferenceSFW(sfwbPrefId)

  let preferencesDB = (await readPreference(prefId, ['server_preference', 'use_time', 'preferencesReport']))?.toJSON()

  if (!preferencesDB) await redisClientPub.publish('channel-ws-1', JSON.stringify({ preferences: { delete: true, id: prefId }, prefId }))
  else {
    if (prefId !== 1) {
      const tempPreferenceDB = (await readPreference(1, ['server_preference', 'use_time', 'preferencesReport']))?.toJSON()
      preferencesDB = {
        ...tempPreferenceDB,
        id: preferencesDB.id,
        groupId: preferencesDB.groupId,
        use_time: preferencesDB.use_time
      }
    }

    const preferences = {
      times: {
        time_connection: preferencesDB?.time_connection,
        time_persistence: preferencesDB?.time_persistence,
        time_off_line_disconnection: preferencesDB?.time_off_line_disconnection,
        timeouts: preferencesDB?.timeouts
      },
      locations: {
        use_other: preferencesDB?.use_other,
        use_google: preferencesDB?.use_google,
        time_location: preferencesDB?.time_location,
        url_google: preferencesDB?.url_google,
        key_google: preferencesDB?.key_google
      },
      stats: preferencesDB?.stats,
      applications: preferencesDB?.applications,
      lockApps: preferencesDB?.lockApps,
      ResponseSafeWeb: SafeWebPref.responseDefault
    }

    // eslint-disable-next-line camelcase
    const server_preferences = {
      url_secondary: preferencesDB?.server_preference.url_secondary,
      Ws_url: preferencesDB?.server_preference.Ws_url,
      SafeWeb_url: preferencesDB?.server_preference.SafeWeb_url,
      max_licences: preferencesDB?.server_preference?.max_licences,
      project_end_date: preferencesDB?.server_preference?.project_end_date
    }

    if (!preferencesDB.use_time.active_use_time) preferencesDB.use_time.days_id = []
    // eslint-disable-next-line camelcase
    const use_time = preferencesDB?.use_time

    const sfwbPreferences = SafeWebPref
    prefId = preferencesDB.groupId

    const preferencesReport = preferencesDB?.preferencesReport

    // eslint-disable-next-line camelcase
    await redisClientPub.publish('channel-ws-1', JSON.stringify({ preferences, server_preferences, use_time, sfwbPreferences, prefId, sfwbPrefId, preferencesReport }))
  }

  res.status(200).send({ result: true, sendings: [] })
}

const SendSafewebLists = async (req, res) => {
  let data = {}
  if (req?.body?.keyword) data = req?.body
  if (req.path?.includes('whiteList')) {
    data = req.locals?.white
    data.white = true
  }
  if (req.path?.includes('blackList')) {
    data = req.locals?.black
    data.black = true
  }

  if (Object.keys(data).length > 0) {
    await redisClientPub.publish('channel-ws-3', JSON.stringify(data))
    res.status(200).send({ result: true, sendings: [] })
  }
}

const SendGeofences = async (req, res, next) => {
  const geofences = await getGeofencesOfDevices()
  // console.log({ geofences })
  await redisClientPub.publish('channel-ws-1', JSON.stringify({ geofences }))
  // res.status(200).send({ result: true, sendings: [] })
  next()
}

const SendGroups = async (req, res, next) => {
  const data = req?.locals?.groups
  const groupId = data?.id
  // console.log({ data })
  if (data?.devices?.length > 0) {
    let geofences = await getGeofencesOfDevices()
    geofences = geofences && geofences.length > 0
      ? geofences.map(geo => !geo?.geofences ? { ...geo, geofences: [] } : geo)
      : [{ licence: [], geofences: [] }]

    const licences = data?.devices?.map(dev => dev?.licence)
    await redisClientPub.publish('channel-ws-1', JSON.stringify({ groups: [{ groupId, licences }], geofences }))
  } else {
    await redisClientPub.publish('channel-ws-1', JSON.stringify({ groups: [{ groupId, licences: [] }], geofences: [] }))
  }
  if (req.method === 'PUT') next()
  else { res.status(200).send({ result: true, sendings: [] }) }
}
module.exports = {
  SendActions,
  SendPreferences,
  SendSafewebLists,
  SendGeofences,
  SendGroups
}
