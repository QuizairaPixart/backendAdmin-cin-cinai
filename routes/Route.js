const express = require('express')
const router = express.Router()

const {
  Home,
  Devices,
  Device,
  DeviceConnection,
  DeviceLocations,
  DeviceLastLocation,
  DeviceApplications,
  DeviceTracking,
  DeviceLossReports,
  DeviceDebugLog,
  Groups,
  Group,
  GroupPreferences,
  GroupApplications,
  Preferences,
  PreferencesThief,
  PreferencesReports,
  PreferencesUsageTime,
  PreferencesServer,
  Prueba,
  Users,
  Applications,
  MostUsedApplications,
  Stats,
  Login,
  Actions,
  Action,
  ResetFactory,
  ThiefImage,
  Upload,
  Reports,
  DeviceStats,
  AllTracking,
  Geofences,
  Geofence,
  ConfigGeofence,
  ConfigGeofences,
  download,
  Roles,
  Role,
  MaxLicenses,
  Commands,
  LastCommands,
  Denunciations,
  MissingDevices,
  DevicesUseTime,
  Notifications,
  Leases,
  StatsDevice,
  Events,
  Establishments,
  PdfProcess
} = require('../Controller/Http/HttpCtrl')

const {
  SfwbHomeBlackList,
  SfwbHomeWhiteList,
  SfwbHomeQueryList,
  SfwbHomeSearch,
  SfwbBlack,
  SfwbWhite,
  SfwbQuery,
  SfwbKeyWords,
  SfwbPreferences
} = require('../Controller/Http/SafeWebCtrl')
const { TryCatch } = require('../middlewares/errors/TryCatch')
const { upload } = require('../middlewares/uploadFiles')
const { publicDir } = require('../middlewares/publicDir')
const { PostRxart } = require('../Controller/Http/RxartCucoCtrl')
const { PostProxySafeWeb } = require('../Controller/Http/ProxySafeWebCtrl')
const {
  SendActions,
  SendPreferences,
  SendSafewebLists,
  SendGeofences,
  SendGroups
} = require('../middlewares/WsSender')

// GET leer PAGES________
router.get('/home/:chart', TryCatch(Home))
router.get('/home/connections/:chart/:days', TryCatch(Home))
router.get('/devices/:pagination', TryCatch(Devices))
router.get('/device/data/:id', TryCatch(Device))
router.get('/device/connections/:id', TryCatch(DeviceConnection))
router.get('/device/all_connections/:id', TryCatch(DeviceConnection))
router.get('/device/stats/:id', TryCatch(DeviceStats))
router.get('/device/last_location/:id', TryCatch(DeviceLastLocation))
router.get('/device/locations/:id', TryCatch(DeviceLocations))
router.get('/device/trackings/:id', TryCatch(DeviceTracking))
router.get('/device/loss_reports/:id', TryCatch(DeviceLossReports))
router.get('/device/debug-log/:id', TryCatch(DeviceDebugLog))
router.get('/allTrackings/:id', TryCatch(AllTracking))
router.get('/device/applications/:id', TryCatch(DeviceApplications))
router.get('/groups', TryCatch(Groups))
router.get('/establishments', TryCatch(Establishments))
router.get('/group/applications', TryCatch(GroupApplications))
router.get('/group/:id', TryCatch(Group))
router.get('/preferences/:id', TryCatch(Preferences))
router.get('/preferences/thief/:id', TryCatch(PreferencesThief))
router.get('/preferences/reports/:id', TryCatch(PreferencesReports))
router.get('/preferences/usage-time/:id', TryCatch(PreferencesUsageTime))
router.get('/preferences/server/:id', TryCatch(PreferencesServer))
router.get('/preferences/group/:id', TryCatch(GroupPreferences))
router.get('/applications/:pagination', TryCatch(Applications))
router.get('/applications/mostUsedApplications/:chart', TryCatch(MostUsedApplications))
router.get('/users', TryCatch(Users))
router.get('/prueba', TryCatch(Prueba))
router.get('/actions', TryCatch(Actions))
router.get('/action/:id', TryCatch(Action))
router.get('/thiefImage/:id', TryCatch(ThiefImage))
router.get('/reports/devices', TryCatch(Reports))
router.get('/reports/devices-location-report/:dateFilter', TryCatch(Reports))
router.get('/reports/missing-devices-report/:statusFilter', TryCatch(Reports))
router.get('/reports/reported-devices-report/:statusFilter', TryCatch(Reports))
router.get('/reports/role/:id', TryCatch(Role))
router.get('/reports/charts/:chart', TryCatch(Home))
router.get('/reports/safeweb/queryList/:date', TryCatch(SfwbHomeQueryList))
router.get('/reports/safeweb/search/:chart', TryCatch(SfwbHomeSearch))
router.get('/events/softwareEvents', TryCatch(Events))
router.get('/events/devicesEvents', TryCatch(Events))
router.get('/geofences', TryCatch(Geofences))
router.get('/geofence/:id', TryCatch(Geofence))
router.get('/config-geofence', TryCatch(ConfigGeofences))
router.get('/config-geofence/:id', TryCatch(ConfigGeofence))
router.get('/roles', TryCatch(Roles))
router.get('/commands', TryCatch(Commands))
router.get('/command/:id', TryCatch(Commands))
router.get('/commands/latest/:id', TryCatch(LastCommands))
router.get('/denunciation/:id', TryCatch(Denunciations))
router.get('/notifications', TryCatch(Notifications))
router.get('/devicesUseTime/:time/:id', TryCatch(DevicesUseTime))
router.get('/lease/:id', TryCatch(Leases))
router.get('/stats/devices', TryCatch(StatsDevice))

// SAFEWEB
router.get('/safeweb/home/blackList/:date', TryCatch(SfwbHomeBlackList))
router.get('/safeweb/home/whiteList/:date', TryCatch(SfwbHomeWhiteList))
router.get('/safeweb/home/queryList/:date', TryCatch(SfwbHomeQueryList))
router.get('/safeweb/home/search/:chart', TryCatch(SfwbHomeSearch))
router.get('/safeweb/blackList', TryCatch(SfwbBlack))
router.get('/safeweb/whiteList', TryCatch(SfwbWhite))
router.get('/safeweb/queryList', TryCatch(SfwbQuery))
router.get('/safeweb/keyWords', TryCatch(SfwbKeyWords))
router.get('/safeweb/preferences/:id', TryCatch(SfwbPreferences))
// POST crear

// descarga de archivos //! Solo en caso de ser necesario
router.get('/download/:folder?/:file?/:extension?/:name?', TryCatch(download))

router.post('/actions', TryCatch(Actions), TryCatch(SendActions)) // Accion en tiempo real

router.post('/groups', TryCatch(Groups), TryCatch(SendGroups))
router.post('/lease', TryCatch(Leases))
router.post('/users', TryCatch(Users))
router.post('/geofences', TryCatch(Geofences), TryCatch(SendGeofences), TryCatch(SendPreferences))
router.post('/config-geofence', TryCatch(ConfigGeofences))
router.post('/resetFactory', TryCatch(ResetFactory))
router.post('/roles', TryCatch(Roles))
router.post('/commands', TryCatch(Commands))
router.post('/denunciations', TryCatch(Denunciations))
router.post('/missing-devices', TryCatch(MissingDevices))

// SAFEWEB
router.post('/safeweb/blackList', TryCatch(SfwbBlack), TryCatch(SendSafewebLists))
router.post('/safeweb/whiteList', TryCatch(SfwbWhite), TryCatch(SendSafewebLists))
router.post('/safeweb/queryList', TryCatch(SfwbQuery))
router.post('/safeweb/keyWords', TryCatch(SfwbKeyWords), TryCatch(SendSafewebLists))

//* Subida de archivos
router.post('/upload/:path', publicDir, upload, TryCatch(Upload))
//* bajar a pdf
router.post('/process-pdf', publicDir, TryCatch(PdfProcess))

// PUT actualizar
// router.put(`/action/:id`, TryCatch(Action)); //Accion en tiempo real
router.put('/device', TryCatch(Device))
router.put('/login', TryCatch(Login))
router.put('/groups', TryCatch(Groups), TryCatch(SendGroups), TryCatch(SendPreferences))
router.put('/users', TryCatch(Users))
router.put('/geofences', TryCatch(Geofences), TryCatch(SendGeofences), TryCatch(SendPreferences))
router.put('/config-geofence', TryCatch(ConfigGeofences), TryCatch(SendGeofences), TryCatch(SendPreferences))
router.put('/applications', TryCatch(Applications), TryCatch(SendPreferences))
router.put('/preferences/', TryCatch(Preferences), TryCatch(SendPreferences))
router.put('/preferences/server', TryCatch(PreferencesServer), TryCatch(SendPreferences))
router.put('/preferences/thief', TryCatch(PreferencesThief))
router.put('/preferences/reports', TryCatch(PreferencesReports), TryCatch(SendPreferences))
router.put('/preferences/usage-time', TryCatch(PreferencesUsageTime), TryCatch(SendPreferences))
router.put('/preferences/group', TryCatch(GroupPreferences), TryCatch(SendGroups), TryCatch(SendPreferences))
router.put('/stats', TryCatch(Stats))
router.put('/roles', TryCatch(Roles))
router.put('/command/:id', TryCatch(Commands))
router.put('/denunciations', TryCatch(Denunciations))
router.put('/missing-devices', TryCatch(MissingDevices))
router.put('/notifications', TryCatch(Notifications))
router.put('/lease', TryCatch(Leases))
router.put('/establishments', TryCatch(Establishments))

// SAFEWEB
router.put('/safeweb/blackList', TryCatch(SfwbBlack), TryCatch(SendSafewebLists))
router.put('/safeweb/whiteList', TryCatch(SfwbWhite), TryCatch(SendSafewebLists))
router.put('/safeweb/queryList', TryCatch(SfwbQuery))
router.put('/safeweb/keyWords', TryCatch(SfwbKeyWords), TryCatch(SendSafewebLists))
router.put('/safeweb/preferences', TryCatch(SfwbPreferences), TryCatch(SendPreferences))

// delete borrar
router.delete('/devices/:id', TryCatch(Devices))
router.delete('/groups/:id', TryCatch(Groups), TryCatch(SendGeofences), TryCatch(SendPreferences))
router.delete('/users/:id', TryCatch(Users))
router.delete('/geofences/:id', TryCatch(Geofences), TryCatch(SendGeofences), TryCatch(SendPreferences))
router.delete('/config-geofence/:id', TryCatch(ConfigGeofences))
router.delete('/preferences/group/:id', TryCatch(GroupPreferences), TryCatch(SendPreferences))
router.delete('/roles/:id', TryCatch(Roles))
router.delete('/command/:id', TryCatch(Commands))

// router.delete(`/action/:id`, TryCatch(Action));
// SAFEWEB
router.delete('/safeweb/blackList/:id', TryCatch(SfwbBlack))
router.delete('/safeweb/whiteList/:id', TryCatch(SfwbWhite))
router.delete('/safeweb/queryList/:id', TryCatch(SfwbQuery))
router.delete('/safeweb/keyWords/:id', TryCatch(SfwbKeyWords))

// RxartSecure API CUCO
router.post('/RxartSecure', TryCatch(PostRxart))

// ProxyNode API
router.post('/ProxySafeWeb', TryCatch(PostProxySafeWeb))

// Endpoint de licencias
router.post('/MaxLicenses', TryCatch(MaxLicenses), TryCatch(SendPreferences))

module.exports = router
