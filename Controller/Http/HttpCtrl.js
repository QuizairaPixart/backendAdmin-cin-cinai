const { putLogin } = require('../Proccess/Actions/Login.Ctrl')
const {
  getHomeConnections,
  getHomeStats,
  getHomeLocations,
  getHomeMissingDevices,
  getHomeAllConnections,
  GetNotifications,
  PutNotifications
} = require('../Proccess/Pages/HomeCtrl')
const {
  GetDevices,
  GetDevice,
  GetDeviceConnections,
  GetDeviceLocations,
  GetDeviceLastLocation,
  GetDeviceApplications,
  GetDeviceTracking,
  GetDeviceLossReports,
  GetDeviceStats,
  GetDeviceDebugLog,
  PutDevice,
  DeleteDevice,
  GetTrackingsThief,
  GetDevicesUseTime,
  GetStatsDevice
} = require('../Proccess/Pages/DevicesCtrl')
const { PostActions, PutStat, GetActionsCompleted } = require('../Proccess/Pages/ActionsCtrl')
const {
  getPreference,
  putPreference,
  GetGroupPreferences,
  PutGroupPreferences,
  DeleteGroupPreferences,
  getPreferencesThief,
  putPreferenceThief,
  getPreferencesReports,
  putPreferenceReports,
  getPreferencesUsageTime,
  putPreferencesUsageTime,
  getPreferenceServer,
  putPreferenceServer
} = require('../Proccess/Pages/PreferencesCtrl')
const {
  GetGroups,
  GetGroup,
  PostGroups,
  GetGroupApplications,
  PutGroups,
  DeleteGroups
} = require('../Proccess/Pages/GroupsCtrl')
const {
  GetUsers,
  PostUsers,
  PutUsers,
  DeleteUsers
} = require('../Proccess/Pages/UsersCtrl')
const { getHistoryMaps } = require('../Proccess/Pages/MapsCtrl')
const { factoryReset } = require('../Proccess/Pages/FactoryReset')
const { GetApps, PutApps } = require('../Proccess/Pages/ApplicationsCtrl')
const { thiefImage } = require('../Proccess/Pages/Thief')
const { throwAppError } = require('../../middlewares/errors/AppError')
const { receiveFiles } = require('../Proccess/Actions/UploadCtrl')
const {
  GetGeofences,
  GetOneGeofence,
  PostGeofence,
  PutGeofence,
  DeleteGeofence,
  GetConfigGeo,
  GetConfigGeofences,
  DeleteConfigGeofence,
  PutConfigGeofence,
  PostConfigGeofence
} = require('../Proccess/Pages/GeofencesCtrl')
const { GetRoles, PostRoles, PutRoles, DeleteRoles } = require('../Proccess/Pages/RolesCtrl')
const {
  GetCommand,
  PostCommand,
  PutCommand,
  DeleteCommand,
  GetLastCommands
} = require('../Proccess/Pages/CommandsCtrl')
const { ModyfyLicenses } = require('../Proccess/Actions/ModifyLicences')
const { App } = require('../../config')
const { GetDenunciations, PostDenunciations, PutDenunciations } = require('../Proccess/Pages/DenunciationsCtrl')
const { PostMissingDevices, PutMissingDevices } = require('../Proccess/Pages/MissingDevicesCtrl')
const { GetReports } = require('../Proccess/Pages/ReportsCtrl')
const { GetLeases, PostLeases, PutLeases } = require('../Proccess/Pages/LeasesCtrl')
const { PdfCreate } = require('../Proccess/Actions/PdfCreate')

const Prueba = async (req, res) => {
  res.status(200).send({ req })
}

// PAGES
const Home = async (req, res) => {
  try {
    console.log('http home')
    let response

    if (req.params?.chart === 'connections') { response = await getHomeConnections(req) }
    if (req.params?.chart === 'allConnections') { response = await getHomeAllConnections(req) }
    if (req.params?.chart === 'stats') response = await getHomeStats(req)
    if (req.params?.chart === 'locations') { response = await getHomeLocations(req) }
    if (req.params?.chart === 'missingDevices') { response = await getHomeMissingDevices(req) }

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_HOME')
  }
}

const Devices = async (req, res) => {
  try {
    console.log('http devices')
    let response
    if (req.method === 'GET') response = await GetDevices(req)
    else if (req.method === 'DELETE') response = await DeleteDevice(req)
    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_DEVICES')
  }
}

const Device = async (req, res) => {
  try {
    console.log('http dashboard')
    let response
    if (req.method === 'GET') response = await GetDevice(req)
    if (req.method === 'PUT') response = await PutDevice(req)
    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_DEVICE')
  }
}
const DeviceStats = async (req, res) => {
  try {
    console.log('http dashboard-device-stats')
    let response = null

    response = await GetDeviceStats(req)

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_DEVICE_STATS')
  }
}

const StatsDevice = async (req, res) => {
  try {
    console.log('http stats-device-report')
    let response = null

    response = await GetStatsDevice(req)

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_STATS_DEVICE')
  }
}

const DeviceConnection = async (req, res) => {
  try {
    console.log('http dashboard-device-connections')
    let response = null

    response = await GetDeviceConnections(req)

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_DEVICE_CONNECTION')
  }
}

const Notifications = async (req, res) => {
  try {
    console.log('http notifications')
    let response
    if (req.method === 'GET') { response = await GetNotifications(req) }
    if (req.method === 'PUT') { response = await PutNotifications(req) }

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_NOTIFICATIONS')
  }
}

const DevicesUseTime = async (req, res) => {
  try {
    console.log('http devices-use-time')
    let response
    if (req.method === 'GET') { response = await GetDevicesUseTime(req) }

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_DEVICES_USE_TIME')
  }
}

const DeviceLocations = async (req, res) => {
  try {
    console.log('http device-locations')
    let response = null

    response = await GetDeviceLocations(req)

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_DEVICE_LOCATIONS')
  }
}

const DeviceLastLocation = async (req, res) => {
  try {
    console.log('http dashboard-last-location')
    let response = null

    response = await GetDeviceLastLocation(req)

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_DEVICE_LAST_LOCATION')
  }
}

const DeviceApplications = async (req, res) => {
  try {
    console.log('http dashboard-device-applications')
    let response = null

    response = await GetDeviceApplications(req)

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_DEVICE_APPLICATIONS')
  }
}

const DeviceTracking = async (req, res) => {
  try {
    console.log('http dashboard-device-tracking')
    let response = null

    response = await GetDeviceTracking(req)

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_DEVICE_TRACKING')
  }
}

const AllTracking = async (req, res) => {
  try {
    console.log('http GetTrackingsThief')
    let response = null

    response = await GetTrackingsThief(req)

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_ALL_TRACKING')
  }
}

const DeviceLossReports = async (req, res) => {
  try {
    console.log('http dashboard-device-loss-reports')
    let response = null

    response = await GetDeviceLossReports(req)

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_DEVICE_LOSS_REPORTS')
  }
}

const DeviceDebugLog = async (req, res) => {
  try {
    console.log('http GetDeviceDebugLog')
    let response = null

    response = await GetDeviceDebugLog(req)
    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_DEVICE_DEBUG_LOG')
  }
}

const Maps = async (req, res) => {
  try {
    console.log('http maps')
    const response = await getHistoryMaps(req)
    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_MAPS')
  }
}

const Groups = async (req, res, next) => {
  try {
    console.log('http groups')
    let response = null
    if (req.method === 'POST') response = await PostGroups(req)
    else if (req.method === 'PUT') response = await PutGroups(req)
    else if (req.method === 'DELETE') response = await DeleteGroups(req)
    else if (req.method === 'GET') response = await GetGroups(req)

    if (response.status === 201) next()
    else res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_GROUPS')
  }
}

const Group = async (req, res) => {
  try {
    console.log('http group')
    const response = await GetGroup(req)
    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_GROUP')
  }
}

const GroupApplications = async (req, res) => {
  try {
    console.log('http dashboard-device-applications')
    let response = null

    response = await GetGroupApplications(req)

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_DEVICE_APPLICATIONS')
  }
}

const GroupPreferences = async (req, res, next) => {
  try {
    console.log('http groupPreferences')
    let response

    if (req.method === 'PUT') response = await PutGroupPreferences(req)
    else if (req.method === 'DELETE') response = await DeleteGroupPreferences(req)
    else if (req.method === 'GET') response = await GetGroupPreferences(req)
    if (response.status === 201) next()
    else res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_GROUP_PREFERENCES')
  }
}

const Applications = async (req, res, next) => {
  try {
    console.log('http Applications')
    let response
    if (req.method === 'GET') response = await GetApps(req)
    else if (req.method === 'PUT') response = await PutApps(req)
    if (response.status === 201) next()
    else res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_APPS')
  }
}

const MostUsedApplications = async (req, res, next) => {
  try {
    console.log('http MostUsedApplications')
    let response
    if (req.method === 'GET') response = await GetApps(req)
    if (response.status === 201) next()
    else res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_MOST_USED_APPS')
  }
}

const Preferences = async (req, res, next) => {
  try {
    console.log('http preferences')
    let response

    if (req.method === 'PUT') response = await putPreference(req)
    else response = await getPreference(req)

    if (response.status === 201) next()
    else res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_PREFERENCES')
  }
}

const PreferencesThief = async (req, res) => {
  try {
    console.log('http defaultthief')
    let response
    if (req.method === 'PUT') {
      response = await putPreferenceThief(req)
    } else {
      response = await getPreferencesThief(req)
    }
    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_PREFERENCES_THIEF')
  }
}

const PreferencesReports = async (req, res, next) => {
  try {
    console.log('http defaultReports')
    let response
    if (req.method === 'PUT') response = await putPreferenceReports(req)
    else response = await getPreferencesReports(req)

    if (response.status === 201 && response.flag) next()
    else res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_PREFERENCES_REPORTS')
  }
}

const PreferencesUsageTime = async (req, res, next) => {
  try {
    console.log('http defaultUsageTime')
    let response

    if (req.method === 'PUT') response = await putPreferencesUsageTime(req)
    else response = await getPreferencesUsageTime(req)

    if (response.status === 201 && response.flag) next()
    else res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_PREFERENCES_USAGE_TIME')
  }
}

const PreferencesServer = async (req, res, next) => {
  try {
    console.log('http preferences_server')
    let response

    if (req.method === 'PUT') response = await putPreferenceServer(req)
    else response = await getPreferenceServer(req)

    if (response.status === 201 && response.flag) next()
    else res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_PREFERENCES_SERVER')
  }
}

const Users = async (req, res) => {
  try {
    console.log('http users')
    let response
    if (req.method === 'POST') response = await PostUsers(req)
    else if (req.method === 'PUT') response = await PutUsers(req)
    else if (req.method === 'DELETE') response = await DeleteUsers(req)
    else response = await GetUsers(req)
    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_USERS')
  }
}

const Actions = async (req, res, next) => {
  try {
    console.log('http actions')
    let response
    // if (req.method === 'GET') response = await GetActions(req)
    if (req.method === 'POST') response = await PostActions(req)
    if (response.status === 201) {
      // carga la variable para el siguiente middleware
      req.locals = { id: response.send }
      next()
    } else {
      res.status(response.status).send(response.send)
    }
  } catch (e) {
    throwAppError(e, 'ERR_ACTIONS')
  }
}

const Action = async (req, res, next) => {
  try {
    console.log('http action')
    let response
    if (req.method === 'GET') response = await GetActionsCompleted(req)
    // if (req.method == 'GET') response = await GetAction(req)
    // else if (req.method == "PUT") response = await PutAction(req);
    // else if (req.method == "DELETE") response = await DeleteAction(req);
    if (response.status === 200) { res.status(response.status).send(response.send) }
  } catch (e) {
    throwAppError(e, 'ERR_ACTION')
  }
}

const Login = async (req, res) => {
  try {
    console.log('http login')
    let response = null
    response = await putLogin(req)
    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_LOGIN')
  }
}

const ResetFactory = async (req, res) => {
  try {
    console.log('http resetFactory')
    let response = null
    response = await factoryReset(req)
    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_RESET_FACTORY')
  }
}

const ThiefImage = async (req, res) => {
  try {
    console.log('http ThiefImage')
    const response = await thiefImage(req)
    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_THIEF_IMG')
  }
}

const Stats = async (req, res) => {
  try {
    console.log('http Stats')
    let response = null
    response = await PutStat(req)
    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_STATS')
  }
}

const Upload = async (req, res) => {
  try {
    console.log('http Upload')
    let response = null
    response = await receiveFiles(req)

    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_UPLOAD')
  }
}

const Geofences = async (req, res, next) => {
  try {
    console.log('http geofences')
    let response
    if (req.method === 'POST') response = await PostGeofence(req)
    else if (req.method === 'PUT') response = await PutGeofence(req)
    else if (req.method === 'DELETE') response = await DeleteGeofence(req)
    else if (req.method === 'GET') response = await GetGeofences(req)

    if (response.status === 201) next()
    else { res.status(response.status).send(response.send) }
  } catch (e) {
    throwAppError(e, 'ERR_GEOFENCES')
  }
}

const Geofence = async (req, res) => {
  try {
    console.log('http geofence')
    const response = await GetOneGeofence(req)
    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_GEOFENCE')
  }
}

const ConfigGeofence = async (req, res) => {
  try {
    console.log('http configGeofence')
    const response = await GetConfigGeo(req)
    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_CONFIG_GEOFENCE')
  }
}

const ConfigGeofences = async (req, res, next) => {
  try {
    console.log('http configGeofences')
    let response
    if (req.method === 'POST') response = await PostConfigGeofence(req)
    else if (req.method === 'PUT') response = await PutConfigGeofence(req)
    else if (req.method === 'DELETE') response = await DeleteConfigGeofence(req)
    else if (req.method === 'GET') response = await GetConfigGeofences(req)
    if (response.status === 201) next()
    else { res.status(response.status).send(response.send) }
  } catch (e) {
    throwAppError(e, 'ERR_CONFIG_GEOFENCES')
  }
}

const Roles = async (req, res) => {
  try {
    console.log('http Roles')
    let response
    if (req.method === 'GET') { response = await GetRoles(req) }
    if (req.method === 'POST') { response = await PostRoles(req) }
    if (req.method === 'PUT') { response = await PutRoles(req) }
    if (req.method === 'DELETE') { response = await DeleteRoles(req) }

    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_ROLES')
  }
}
const Role = async (req, res) => {
  try {
    console.log('http Role')
    const response = await GetRoles(req)

    res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_ROLE')
  }
}
const MaxLicenses = async (req, res, next) => {
  if (await ModyfyLicenses(req))next()
  else res.status(500).send('error')
}

const Commands = async (req, res /* next */) => {
  try {
    console.log('http Commands')
    let response
    if (req.method === 'GET') { response = await GetCommand(req) }
    if (req.method === 'POST') { response = await PostCommand(req) }
    if (req.method === 'PUT') { response = await PutCommand(req) }
    if (req.method === 'DELETE') { response = await DeleteCommand(req) }

    // if (response.status === 201) next()
    res.status(response.status).send(response.send)
  } catch (e) {
    console.log({ e })
    throwAppError(e, 'ERR_COMMANDS')
  }
}

const LastCommands = async (req, res) => {
  try {
    let response
    if (req.method === 'GET') { response = await GetLastCommands(req) }

    res.status(response.status).send(response.send)
  } catch (e) {
    console.log({ e })
    throwAppError(e, 'ERR_LAST_COMMANDS')
  }
}

const Reports = async (req, res = { status: 500, send: { auth: false } }) => {
  try {
    console.log('http reports')

    const response = await GetReports(req)

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_REPORTS')
  }
}

const Denunciations = async (req, res) => {
  try {
    console.log('http Denunciations')
    let response
    if (req.method === 'GET') { response = await GetDenunciations(req) }
    if (req.method === 'POST') { response = await PostDenunciations(req) }
    if (req.method === 'PUT') { response = await PutDenunciations(req) }
    // if (req.method === 'DELETE') { response = await DeleteCommand(req) }

    res.status(response.status).send(response.send)
  } catch (e) {
    console.log({ e })
    throwAppError(e, 'ERR_DENUNCIATIONS')
  }
}

const MissingDevices = async (req, res) => {
  try {
    console.log('http missing-devices')
    let response
    // if (req.method === 'GET') { response = await GetDenunciations(req) }
    if (req.method === 'POST') { response = await PostMissingDevices(req) }
    if (req.method === 'PUT') { response = await PutMissingDevices(req) }

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_MISSING_DEVICES')
  }
}

const Leases = async (req, res) => {
  try {
    console.log('http leases')
    let response
    if (req.method === 'GET') { response = await GetLeases(req) }
    if (req.method === 'POST') { response = await PostLeases(req) }
    if (req.method === 'PUT') { response = await PutLeases(req) }

    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_LEASES')
  }
}

const download = async (req, res) => {
  try {
    const file = `${App.dirstorage}/${req.params.folder}/${req.params.file}.${req.params.extension}`

    if (req.params.folder === 'Denunciations') {
      await res.download(file, `${req.params.name}`)
    } else {
      await res.download(file)
    }
  } catch (e) {
    console.log({ e })
    throwAppError(e, 'ERR_DOWNLOAD')
  }
}

const PdfProcess = async (req, res) => {
  let response
  if (req.method === 'POST') response = await PdfCreate(req.body)
  res.status(response?.status ?? 500).send(response.filePath)
}

module.exports = {
  Home,
  Devices,
  Device,
  DeviceConnection,
  Notifications,
  DevicesUseTime,
  DeviceLocations,
  DeviceLastLocation,
  DeviceApplications,
  DeviceTracking,
  DeviceStats,
  StatsDevice,
  DeviceLossReports,
  DeviceDebugLog,
  Maps,
  Groups,
  Group,
  GroupPreferences,
  GroupApplications,
  Applications,
  MostUsedApplications,
  Preferences,
  PreferencesThief,
  PreferencesReports,
  PreferencesUsageTime,
  PreferencesServer,
  Users,
  Prueba,
  Actions,
  Action,
  Login,
  ResetFactory,
  ThiefImage,
  Stats,
  Upload,
  Reports,
  AllTracking,
  Geofences,
  Geofence,
  ConfigGeofence,
  ConfigGeofences,
  Roles,
  Role,
  MaxLicenses,
  Commands,
  LastCommands,
  Denunciations,
  MissingDevices,
  Leases,
  PdfProcess,
  download

}
