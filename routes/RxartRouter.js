const rxRouter = require('express').Router()
const { countDevices, queryDevices, queryDevicesPixtech, querySearchDevices, obtainLastTicket, calculateTicket, changeDeviceStatus, queryPreferencesClient, changePreferencesClient, queryPreferencesDevice, changePreferencesDevice, queryProject, changePreferencesProject, preferences, licenseActivation } = require('../Controller/Http/RxartSecureCtrl')
const { TryCatch } = require('../middlewares/errors/TryCatch')

// rxartsecure/endpoint
rxRouter
  .get('/query_device_count', TryCatch(countDevices))
  .get('/query_devices', TryCatch(queryDevices))
  .get('/query_device/:deviceId', TryCatch(queryDevicesPixtech)) // get para Pixtech
  .get('/query_devices/:deviceId', TryCatch(queryDevices)) // get para mostrar los datos del disposito en el modal de Rxart Secure
  .get('/query_search_device/:filter', TryCatch(querySearchDevices))
  .get('/query_last_ticket/:deviceId', TryCatch(obtainLastTicket))
  .get('/query_preferences_client/:id', TryCatch(queryPreferencesClient))
  .get('/query_preferences_device/:id', TryCatch(queryPreferencesDevice))
  .get('/query_project', TryCatch(queryProject))
  .get('/preferences', TryCatch(preferences))
  .post('/query_calc_unlock_code', TryCatch(calculateTicket))
  .post('/change_device_data/:id', TryCatch(changeDeviceStatus))
  .post('/change_preferences_client/:id', TryCatch(changePreferencesClient))
  .post('/change_preferences_device/:id', TryCatch(changePreferencesDevice))
  .post('/change_preferences_project', TryCatch(changePreferencesProject))
  .post('/change_preferences_project', TryCatch(changePreferencesProject))
  .post('/license_activation', TryCatch(licenseActivation))
  .put('/preferences', TryCatch(preferences))

module.exports = rxRouter
