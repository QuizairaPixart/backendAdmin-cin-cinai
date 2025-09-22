const { validateToken } = require('./UserValidations')
const { psql, sfwb, rxartPsql, redisClientPub } = require('../db/db')
const {
  createGroup,
  createUser
} = require('../Controller/Databases/CRUD-Client')
const { defaults } = require('../defaults')
// const { serial } = require('../utils/serials.json')
const {
  createPreference,
  createServerPreference,
  createDefaultThief,
  createReports,
  createUseTime
} = require('../Controller/Databases/CRUD-Preferences')
const {
  CreateSafewebPreference
} = require('../Controller/Databases/CRUD-SafeWeb')
// const {
//  createDevicesAndSerial
// } = require('../Controller/Databases/CRUD-Devices')
const {
  createDefaultApps
} = require('../Controller/Databases/CRUD-Applications')
const {
  createConfigGeofence
} = require('../Controller/Databases/CRUD-Geofences')
const { createRoles } = require('../Controller/Databases/CRUD-Roles')
const { setRxartPrefClients } = require('../Controller/Databases/RxartSecure/PreferencesClient')
const { licenceModel } = require('../models/Mongo/Licences-Model')
const { establishmentsData } = require('../utils/EstablishmentsData.json')
const { createEstablishments } = require('../Controller/Databases/CRUD-Establishments')
const config = require('../config')

const Restore = async (req, res) => {
  let response = { status: 403, send: false }
  const validate = await validateToken(req.user, req.token)
  const restoreMDM = req.mdm
  const restoreSFWB = req.safeweb
  const restoreRxart = req.rxart

  if (validate.status === true) {
    const restore = await RestoreDB(restoreMDM, restoreSFWB, restoreRxart)
    if (restore === true) {
      response = { status: 200, send: true }
    }
  }
  return response
}

const RestoreDB = async (mdm, safeweb, rxart) => {
  let result
  try {
    if (mdm) {
      await psql.dropSchema('geostats')
      await psql.createSchema('geostats')
      config.App.restoreMongoDB ?? await licenceModel.deleteMany()
    }
    if (safeweb) {
      await sfwb.dropSchema('safeWeb')
      await sfwb.createSchema('safeWeb')
    }

    if (mdm) await psql.sync({ force: true, alter: true })
    if (safeweb) await sfwb.sync({ force: true, alter: true })
    if (rxart) await rxartPsql.sync({ force: true, alter: true })

    if (mdm) {
      const user = await createDefaultUser() // creo usuario System

      // ?creo por defecto los elementos
      const [
        thief,
        report,
        serverPref,
        useTime,
        pref,
        roles,
        group
        // configGeofences,
        // devicesSerial,
        // applications,
      ] = await Promise.all([
        CreateDefaultThiefs(),
        createDefaultReports(),
        createDefaultServerPreferences(),
        createDefaultUseTime(),
        createDefaultPreferences(),
        createDefaultRoles(),
        createDefaultGroups(),
        createDefaultConfigGeofences(),
        createDefaultDevices(),
        createDefaultApplications(),
        importEstablishments()
      ])

      console.log('creados =>', { thief: thief?.id, report: report?.id, serverPref: serverPref?.id, useTime: useTime?.id, pref: pref?.id, group: group?.id })
      pref.defaultThiefId = thief?.id
      pref.preferencesReportId = report?.id
      pref.serverPreferenceId = serverPref?.id
      pref.useTimeId = useTime?.id
      pref.groupId = group?.id
      // console.log(roles)
      await pref.save()
      await user.addRoles(roles?.id).catch((err) => console.log({ err }, 'falla aca'))
    }

    if (safeweb) {
      const sfwb = await createDefaultSafeweb() // creo por defecto safeweb
      sfwb.preferenceId = 1
      sfwb.save()
    }

    if (rxart) await createDefaultRxartPrefClient()

    await cleanRedis()
    result = true
    return result
  } catch (error) {
    console.log('restoreDB: ' + error)
    result = false
    return result
  }
}

const createDefaultUser = async () => { //
  console.log('user', defaults.users)
  return await createUser(defaults.users)
}
const CreateDefaultThiefs = async () => {
  console.log('thief', defaults.thief)
  return await createDefaultThief(defaults.thief)
}
const createDefaultReports = async () => {
  console.log('reports', defaults.reports)
  return await createReports(defaults.reports)
}
const createDefaultServerPreferences = async () => {
  console.log('serverPreference', defaults.serverPreference)
  return await createServerPreference(defaults.serverPreference)
}
const createDefaultPreferences = async () => {
  console.log('pref', defaults.preferences)
  return await createPreference(defaults.preferences)
}
const createDefaultRoles = async () => {
  console.log('roles', defaults.roles)
  return await createRoles(defaults.roles)
}
const createDefaultApplications = async () => {
  console.log('Apps', defaults.preferences.lockApps)
  if (defaults.preferences.lockApps.length > 0) { await createDefaultApps(defaults.preferences.lockApps) }
}
const createDefaultGroups = async () => {
  console.log('group', defaults.groups)
  return await createGroup(defaults.groups)
}

const createDefaultDevices = async () => {
  // console.log("devices",serial);
  // return await createDevicesAndSerial(serial)
}
const createDefaultSafeweb = async () => {
  console.log('safeWeb', defaults.safeweb)
  return await CreateSafewebPreference(defaults.safeweb)
}

const createDefaultConfigGeofences = async () => {
  console.log('ConfigGeofence', defaults.configGeofences)
  await createConfigGeofence(defaults.configGeofences)
}

const createDefaultUseTime = async () => {
  console.log('use_times', defaults.useTime)
  return await createUseTime(defaults.useTime)
}

const createDefaultRxartPrefClient = async () => {
  console.log('rxartPrefClient', defaults.rxartPrefClient)
  return await setRxartPrefClients(null, defaults.rxartPrefClient)
}

// ? se agrego un limpiador de redis cuando se reinicia la BD
const cleanRedis = async () => {
  return await redisClientPub.flushall()
}

// ? en caso de necesitar restaurar la DB sin tener acceso al portal se puede usar la funcion =>
// RestoreDB(true, true, true)

// función para agregar Establecimientos
const importEstablishments = async () => {
  console.log('createEstablishments')
  return await createEstablishments(establishmentsData)
}

module.exports = { Restore }
