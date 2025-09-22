const { cronTask } = require('../../../helpers/Cron')
const { readGroup } = require('../../Databases/CRUD-Client')
const { useTimePreference } = require('../Actions/PreferencesCtrl')
const PreferencesDB = require('../../Databases/CRUD-Preferences')

// get preference
const getPreference = async (req) => {
  const response = {}
  const id = parseInt(req.params.id)
  const preferences = await PreferencesDB.readPreference(id, { all: true })

  if (preferences) {
    response.status = 200
    response.send = preferences
  } else {
    response.status = 204
    response.send = { result: false }
  }
  return response
}
// set preferences

const putPreference = async (req, res) => {
  const response = {}
  const { body } = req
  const id = +body?.id

  let preference = await PreferencesDB.updatePreference({ id }, body)
  preference = preference[1][0]?.toJSON()

  if (preference) {
    response.status = 201
    response.send = { result: true }
    req.locals = { preference }
  } else {
    response.status = 204
    response.send = { result: false }
  }
  return response
}

// get group preferences
const GetGroupPreferences = async (req, res) => {
  const response = {}
  const params = JSON.parse(req.params.id)

  let preferences = await PreferencesDB.readPreference({ groupId: parseInt(params.id) }, params.typeOfPreferences)
  if (preferences === null) preferences = await PreferencesDB.readPreference({ id: 1 }, params.typeOfPreferences)

  if (preferences) {
    preferences = { [params.typeOfPreferences]: preferences[params.typeOfPreferences], preferenceId: preferences.id }
    response.status = 200
    response.send = preferences
  } else {
    response.status = 204
    response.send = { result: false }
  }

  return response
}

// put custom group preferences
const PutGroupPreferences = async (req, result) => {
  const response = {}
  let generalPreferences = null
  // let particularPreferences = null
  // let json = {}
  const { groupId, typeOfPreferences, data, preferenceId } = req.body
  delete data.id

  // console.log(groupId, typeOfPreferences, data, preferenceId)

  if (preferenceId) {
    generalPreferences = await PreferencesDB.readPreference({ id: preferenceId })
  } else {
    generalPreferences = await PreferencesDB.readPreference({ id: 1 })
    generalPreferences = await generalPreferences.toJSON()
    // console.log(generalPreferences)
    delete generalPreferences.id
    delete generalPreferences.useTimeId
    generalPreferences = await PreferencesDB.createPreference(generalPreferences)
  }
  generalPreferences.groupId = groupId[0]
  let typeRsult
  switch (typeOfPreferences) {
    case 'use_time':
      typeRsult = await useTimePreference(generalPreferences.useTimeId, data)

      if (!typeRsult.error) { generalPreferences.useTimeId = typeRsult.useTime.id }
      await generalPreferences.save()
      result = true
      break
  }
  // generalPreferences = generalPreferences.toJSON()
  // // console.log(generalPreferences)
  // const { /* defaultThiefId, preferencesReportId, serverPreferenceId, */ useTimeId } = generalPreferences
  // // console.log(defaultThiefId, preferencesReportId, serverPreferenceId, useTimeId)

  // if (typeOfPreferences === 'use_time') {
  //   particularPreferences = await useTimePreference(useTimeId, data)
  //   if (particularPreferences.flag) generalPreferences.useTimeId = particularPreferences.id
  // }

  // if (particularPreferences.flag) {
  //   json = generalPreferences
  //   delete json.id
  //   const createdPreferences = await PreferencesDB.createPreference(json)
  //   if (createdPreferences) result = true
  // } else {
  //   result = true
  // }

  if (result) {
    const devicesDB = await readGroup({ id: groupId[0] }, 'devices')
    response.status = 201
    response.send = { result: true }
    req.locals = { preference: generalPreferences, groups: { id: groupId[0], devices: devicesDB.devices } }
  } else {
    response.status = 204
    response.send = { result: false }
  }

  return response
}

const DeleteGroupPreferences = async (req, res) => {
  const response = {}
  const groupId = JSON.parse(req.params.id)
  let preferences = null
  let preferenceId = null
  let deleteGroupPreference = null
  let flag = false

  preferences = await PreferencesDB.readPreference({ groupId })
  preferenceId = preferences.id

  const { /* defaultThiefId, preferencesReportId, */ serverPreferenceId, useTimeId } = preferences
  // console.log(defaultThiefId, preferencesReportId, serverPreferenceId, useTimeId)

  if (useTimeId !== 1) {
    await PreferencesDB.deleteUseTime({ id: useTimeId })
    flag = true
  }

  if (serverPreferenceId !== 1) {
    await PreferencesDB.deleteServerPreference({ id: serverPreferenceId })
    flag = true
  }

  if (flag) {
    deleteGroupPreference = await PreferencesDB.deletePreference({ id: preferenceId })
  }

  if (deleteGroupPreference) {
    req.locals = { preference: { id: groupId, delete: true } }
    response.status = 201
    response.send = { result: true }
  } else {
    response.status = 204
    response.send = { result: false }
  }

  return response
}

// get preferenceThief
const getPreferencesThief = async (req) => {
  const response = {}
  const id = parseInt(req.params.id)
  const defThief = await PreferencesDB.readDefaultThief(id)
  if (defThief) {
    response.status = 200
    response.send = defThief
  } else {
    response.status = 204
    response.send = { result: false }
  }
  return response
}

// set preferences

const putPreferenceThief = async (req, res) => {
  const response = {}
  const data = req.body
  const id = parseInt(data.id)
  const preference = await PreferencesDB.updateDefaultThief(
    { id },
    { include: 'preferences' },
    data
  )
  if (preference) {
    response.status = 200
    response.send = { result: true }
  } else {
    response.status = 204
    response.send = { result: false }
  }
  return response
}

// get preferenceReports
const getPreferencesReports = async (req) => {
  const response = {}
  const id = parseInt(req.params.id)
  const Report = await PreferencesDB.readReports(id)
  if (Report) {
    response.status = 200
    response.send = Report
  } else {
    response.status = 204
    response.send = { result: false }
  }
  return response
}

// set preferences

const putPreferenceReports = async (req, res = { status: 500, send: { auth: false } }) => {
  const id = parseInt(req.body?.data?.id)
  const groupId = parseInt(req.body?.groupId)
  const data = req.body.data
  const group = await readGroup(groupId)

  if (!groupId || (group.id !== 1 && group.users.length === 0)) { return (res = { status: 400, send: { result: false } }) }

  const Report = await PreferencesDB.updateReports(
    { id },
    { all: true },
    data
  )

  if (Report?.reportsDays) {
    await cronTask(Report, true)
  }

  if (Report) {
    res.status = 201
    res.send = { result: true }
    res.flag = true
  } else {
    res.status = 204
    res.send = { result: false }
  }
  return res
}

const getPreferencesUsageTime = async (req) => {
  const response = {}
  const id = parseInt(req.params.id)
  const UsageTime = await PreferencesDB.readUseTime(id, { all: true })
  if (UsageTime) {
    response.status = 200
    response.send = UsageTime
  } else {
    response.status = 204
    response.send = { result: false }
  }
  return response
}

const putPreferencesUsageTime = async (req) => {
  const response = {}
  const data = req.body
  const id = parseInt(data.id)

  const UsageTime = await PreferencesDB.updateUseTime({ id }, data)

  if (UsageTime) {
    response.status = 201
    response.send = { result: true }
    response.flag = true
  } else {
    response.status = 204
    response.send = { result: false }
  }

  return response
}

// get server_preference
const getPreferenceServer = async (req) => {
  const response = {}
  const id = parseInt(req.params.id)
  const preferences = await PreferencesDB.readServerPreference(id)

  if (preferences) {
    response.status = 200
    response.send = preferences
  } else {
    response.status = 204
    response.send = { result: false }
  }
  return response
}

// set server_preference
const putPreferenceServer = async (req) => {
  const response = {}
  let flag = false
  const data = req.body
  const id = parseInt(data.id)
  // eslint-disable-next-line camelcase
  const { url_secondary, Ws_url, SafeWeb_url, project_end_date } = await PreferencesDB.readServerPreference(id)

  // eslint-disable-next-line camelcase
  if (data.url_secondary !== url_secondary || data.Ws_url !== Ws_url || data.SafeWeb_url[0] !== SafeWeb_url[0] || data.SafeWeb_url[1] !== SafeWeb_url[1] || data.project_end_date !== project_end_date) flag = true

  const ServerPreferences = await PreferencesDB.updateServerPreference({ id }, data)

  if (ServerPreferences) {
    response.status = 201
    response.send = { result: true }
    response.flag = flag
  } else {
    response.status = 204
    response.send = { result: false }
  }
  return response
}

module.exports = {
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
}
