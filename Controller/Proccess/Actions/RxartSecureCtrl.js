const { getTotalRxartDevices, setRxartDevice } = require('../../Databases/RxartSecure/Devices')
const { getRxartClients, setRxartPrefClients } = require('../../Databases/RxartSecure/PreferencesClient')
const { getRxartTickets } = require('../../Databases/RxartSecure/Tickets')
const { ApiRxartSecure } = require('../../../config')
const { getWan } = require('../../../helpers/getIpWan')
const { getUsers } = require('./UsersCtrl')

const totalDevices = async (req, res = { status: 500, result: false }) => {
  const deviceCount = await getTotalRxartDevices()

  if (deviceCount) {
    res.status = 200
    res.send = deviceCount
  }

  return res
}

const getDevices = async (req, res = { status: 500, result: false }) => {
  const { deviceId, serialBios } = req?.params

  const fetch = (await import('node-fetch')).default

  const myHeaders = { Authorization: `Bearer ${ApiRxartSecure.bearerToken}`, projectId: `${ApiRxartSecure.projectId}` }

  const route = `${ApiRxartSecure.url}/device`

  if (deviceId) {
    myHeaders.deviceId = deviceId
  } else if (serialBios) {
    myHeaders.biosSerial = serialBios
  }

  const requestOptions = {
    method: 'GET',
    headers: myHeaders
  }

  const request = await fetch(route, requestOptions).then(async response => {
    if (!response.ok) {
      const errorText = await response.text()
      const message = `Error ${response.status}: ${response.statusText}\nResponse: ${errorText}`
      res.status = response.status
      res.send = message
      throw new Error(message)
    }
    return response.json()
  }).then(data => data).catch(error => console.error('Fetch error:', error.message))
  // console.log(request, 'línea 47')

  let json
  let deviceDb
  let preferenceDb

  if (request) {
    // console.log(ticket, 'línea 54')
    deviceDb = request.device
    delete deviceDb.preferenceId

    preferenceDb = request.preference

    json = {
      device: {
        ...deviceDb,
        statusId: request.status.blocked ? 'BL' : request.status.free ? 'FR' : 'AC',
        statusName: request.status.blocked ? 'Locked' : request.status.free ? 'Free' : 'Active',
        license: request.status.licenseId
      },
      preferences: {
        ...preferenceDb
      }
    }

    res = { status: 200, send: json }
  } else {
    res = { status: 406, send: { error: 'No Devices found!' } }
  }

  return res
}

const getDevicesPixtech = async (req, res = { status: 500, result: false }) => {
  const { deviceId, serialBios } = req?.params

  const fetch = (await import('node-fetch')).default

  const myHeaders = { Authorization: `Bearer ${ApiRxartSecure.bearerToken}`, projectId: `${ApiRxartSecure.projectId}` }

  const route = `${ApiRxartSecure.url}/device`

  if (deviceId) {
    myHeaders.deviceId = deviceId
  } else if (serialBios) {
    myHeaders.biosSerial = serialBios
  }

  const requestOptions = {
    method: 'GET',
    headers: myHeaders
  }

  const request = await fetch(route, requestOptions).then(async response => {
    if (!response.ok) {
      const errorText = await response.text()
      const message = `Error ${response.status}: ${response.statusText}\nResponse: ${errorText}`
      res.status = response.status
      res.send = message
      throw new Error(message)
    }
    return response.json()
  }).then(data => data).catch(error => console.error('Fetch error:', error.message))
  // console.log(request, 'línea 43')

  let json
  let deviceDb

  if (request) {
    deviceDb = request.device

    // json = {
    //   device: {
    //     ...deviceDb,
    //     statusId: request.status.blocked ? 'BL' : request.status.free ? 'FR' : 'AC',
    //     statusName: request.status.blocked ? 'Locked' : request.status.free ? 'Free' : 'Active',
    //     license: request.status.licenseId
    //   },
    //   preferences: {
    //     ...preferenceDb
    //   }
    // }

    json = {
      deviceId: deviceDb.deviceId,
      bootCount: null,
      validationDate: null,
      statusId: request.status.blocked ? 'BL' : request.status.free ? 'FR' : 'AC',
      statusName: request.status.blocked ? 'Locked' : request.status.free ? 'Free' : 'Active',
      deviceType: deviceDb.type,
      serialBios: deviceDb.serialBios,
      osVersion: deviceDb.soVersion,
      model: deviceDb.model,
      clientId: null,
      description: null
    }

    res = { status: 200, send: json }
  } else {
    res = { status: 406, send: { error: 'No Devices found!' } }
  }

  return res
}

const setDevices = async (req, res = { status: 500, result: false }) => {
  const data = req?.body

  const device = await setRxartDevice(data)

  if (device) {
    res.status = 200
    res.send = device
  }

  return res
}

const getLastTicket = async (req, res = { status: 500, result: false }) => {
  const deviceId = +req?.params?.deviceId
  const lastTicket = await getRxartTickets(deviceId)

  if (lastTicket) {
    res.status = 200
    res.send = lastTicket
  }

  return res
}

const updateStatus = async (req, res = { status: 500, result: false }) => {
  const data = req?.body

  const fetch = (await import('node-fetch')).default

  const myHeaders = { Authorization: `Bearer ${ApiRxartSecure.bearerToken}`, projectId: `${ApiRxartSecure.projectId}`, 'Content-Type': 'application/json' }

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify({
      deviceId: data?.deviceId,
      statusId: data?.statusId
    })
  }

  const request = await fetch(`${ApiRxartSecure.url}/device_status`, requestOptions).then(async response => {
    if (!response.ok) {
      const errorText = await response.text()
      const message = `Error ${response.status}: ${response.statusText}\nResponse: ${errorText}`
      res.status = response.status
      res.send = message
      throw new Error(message)
    }
    return response.json()
  }).then(data => data).catch(error => console.error('Fetch error:', error.message))
  // console.log(request, 'línea 86')

  if (request) {
    res.status = 200
    res.send = request
  }

  return res
}

const getPreferencesClient = async (req, res = { status: 500, result: false }) => {
  const id = +req?.params?.id
  const client = await getRxartClients(id)

  if (client) {
    res.status = 200
    res.send = client
  }

  return res
}

const updatePreferencesClient = async (req, res = { status: 500, result: false }) => {
  const id = +req?.params?.id
  const data = req?.body

  const preferenceClient = await setRxartPrefClients(id, data)

  if (preferenceClient) {
    res.status = 200
    res.send = preferenceClient
  }

  return res
}

const getPreferencesDevice = async (req, res = { status: 500, result: false }) => {
  const { id } = req?.params

  const fetch = (await import('node-fetch')).default

  const myHeaders = { Authorization: `Bearer ${ApiRxartSecure.bearerToken}`, deviceId: id, projectId: `${ApiRxartSecure.projectId}` }

  const requestOptions = {
    method: 'GET',
    headers: myHeaders
  }

  const request = await fetch(`${ApiRxartSecure.url}/device`, requestOptions).then(async response => {
    if (!response.ok) {
      const errorText = await response.text()
      const message = `Error ${response.status}: ${response.statusText}\nResponse: ${errorText}`
      res.status = response.status
      res.send = message
      throw new Error(message)
    }
    return response.json()
  }).then(data => data).catch(error => console.error('Fetch error:', error.message))
  // console.log(request, 'línea 43')

  if (request && request?.devices.length > 0) {
    const ticket = request.devices[0].ticket
    // console.log(ticket, 'línea 54')

    const preferences = {
      clientId: null,
      name: null,
      iniTimeout: null,
      lastDate: ticket['max-uses-days'] ? ticket['max-uses-days'] : null,
      tolerance: ticket['advertises-days'] ? ticket['advertises-days'] : null,
      maxBoots: ticket['max-boot'] ? ticket['max-boot'] : null,
      fInterval: ticket['check-interval'] ? ticket['check-interval'] : null,
      msgIT: null,
      msgBW: ticket?.messages ? ticket?.messages.advertise : null,
      msgBT: ticket?.messages ? ticket?.messages.block : null
    }

    res = { status: 200, send: preferences }
  } else {
    res = { status: 406, send: { error: 'No Devices found!' } }
  }

  return res
}

const updatePreferencesDevice = async (req, res = { status: 500, result: false }) => {
  const id = req?.params?.id
  const data = req?.body

  const fetch = (await import('node-fetch')).default

  const myHeaders = { Authorization: `Bearer ${ApiRxartSecure.bearerToken}`, deviceId: id, projectId: `${ApiRxartSecure.projectId}`, 'Content-Type': 'application/json' }

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify(data)
  }

  const request = await fetch(`${ApiRxartSecure.url}/device_settings`, requestOptions).then(async response => {
    if (!response.ok) {
      const errorText = await response.text()
      const message = `Error ${response.status}: ${response.statusText}\nResponse: ${errorText}`
      res.status = response.status
      res.send = message
      throw new Error(message)
    }
    return response.json()
  }).then(data => data).catch(error => console.error('Fetch error:', error.message))
  // console.log(request, 'línea 229')

  if (request) {
    res.status = 200
    res.send = request
  }

  return res
}

const calculateUnlockCode = async (req, res = { status: 500, result: false }) => {
  let body = req?.body
  const ipWan = await getWan(req?.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : req?.ip)
  const flag = req?.headers?.pixtech

  if (flag) {
    body.location.ipWan = ipWan
  } else {
    if (req?.body?.userId === -1) {
      body = {
        ...body,
        location: {
          ipWan
        },
        data: {
          user: 'System'
        }
      }
    } else {
      const user = await getUsers({ id: req?.body?.userId })

      body = {
        ...body,
        location: {
          ipWan
        },
        data: {
          email: user.email,
          name: user.name,
          lastName: user.last,
          phoneNumber: user.phone,
          user: user.user
        }
      }

      delete body.userId
    }
  }

  const fetch = (await import('node-fetch')).default

  const myHeaders = { Authorization: `Bearer ${ApiRxartSecure.bearerToken}`, projectId: `${ApiRxartSecure.projectId}`, 'Content-Type': 'application/json' }

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      ...body,
      projectId: ApiRxartSecure.projectId
    })
  }

  const request = await fetch(`${ApiRxartSecure.url}/code_block`, requestOptions).then(async response => {
    if (!response.ok) {
      const errorText = await response.text()
      const message = `Error ${response.status}: ${response.statusText}\nResponse: ${errorText}`
      res.status = response.status
      res.send = message
      throw new Error(message)
    }
    return response.json()
  }).then(data => data).catch(error => console.error('Fetch error:', error.message))
  // console.log('código de desbloqueo=>', request, 'línea 183')

  if (request) {
    const requestOptions2 = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify({
        statusId: 'AC',
        deviceId: body.deviceId
      })
    }

    const request2 = await fetch(`${ApiRxartSecure.url}/device_status`, requestOptions2).then(async response => {
      if (!response.ok) {
        const errorText = await response.text()
        const message = `Error ${response.status}: ${response.statusText}\nResponse: ${errorText}`
        res.status = response.status
        res.send = message
        throw new Error(message)
      }
      return response.json()
    }).then(data => data).catch(error => console.error('Fetch error:', error.message))
    // console.log('Cambio de estado =>', request2, requestOptions2?.body, 'línea 205')

    if (request2) {
      res.status = 200
      res.send = { code: request?.code }
    }
  }

  return res
}

const getProject = async (req, res = { status: 500, result: false }) => {
  const projectId = parseInt(ApiRxartSecure?.projectId)

  const fetch = (await import('node-fetch')).default

  const myHeaders = { Authorization: `Bearer ${ApiRxartSecure.bearerToken}`, 'Content-Type': 'application/json' }

  const requestOptions = {
    method: 'GET',
    headers: myHeaders
  }

  const request = await fetch(`${ApiRxartSecure.url}/project`, requestOptions).then(async response => {
    if (!response.ok) {
      const errorText = await response.text()
      const message = `Error ${response.status}: ${response.statusText}\nResponse: ${errorText}`
      res.status = response.status
      res.send = message
      throw new Error(message)
    }
    return response.json()
  }).then(data => data).catch(error => console.error('Fetch error:', error.message))
  // console.log(request, 'línea 319')

  if (request && request?.projects.length > 0) {
    const projects = request.projects
    const project = projects?.filter(project => project.projectId === projectId)
    const ticket = project[0].json_data
    // console.log(ticket, 'línea 324')

    const preferences = {
      clientId: null,
      name: null,
      iniTimeout: null,
      lastDate: ticket['max-uses-days'] ? ticket['max-uses-days'] : null,
      tolerance: ticket['advertises-days'] ? ticket['advertises-days'] : null,
      maxBoots: ticket['max-boot'] ? ticket['max-boot'] : null,
      fInterval: ticket['check-interval'] ? ticket['check-interval'] : null,
      msgIT: null,
      msgBW: ticket?.messages ? ticket?.messages.advertise : null,
      msgBT: ticket?.messages ? ticket?.messages.block : null
    }

    res = { status: 200, send: preferences }
  } else {
    res = { status: 406, send: { error: 'Project not found!' } }
  }

  return res
}

const updatePreferencesProject = async (req, res = { status: 500, result: false }) => {
  const data = req?.body

  const fetch = (await import('node-fetch')).default

  const myHeaders = { Authorization: `Bearer ${ApiRxartSecure.bearerToken}`, projectId: `${ApiRxartSecure.projectId}`, 'Content-Type': 'application/json' }

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify(data)
  }

  const request = await fetch(`${ApiRxartSecure.url}/device_settings`, requestOptions).then(async response => {
    if (!response.ok) {
      const errorText = await response.text()
      const message = `Error ${response.status}: ${response.statusText}\nResponse: ${errorText}`
      res.status = response.status
      res.send = message
      throw new Error(message)
    }
    return response.json()
  }).then(data => data).catch(error => console.error('Fetch error:', error.message))
  // console.log(request, 'línea 456')

  if (request) {
    res.status = 200
    res.send = request
  }

  return res
}

const getPreferences = async (req, res = { status: 500, result: false }) => {
  const projectId = ApiRxartSecure.projectId

  const fetch = (await import('node-fetch')).default

  const myHeaders = { Authorization: `Bearer ${ApiRxartSecure.bearerToken}`, projectId, idPref: projectId }

  const requestOptions = {
    method: 'GET',
    headers: myHeaders
  }

  const request = await fetch(`${ApiRxartSecure.url}/preferences`, requestOptions).then(async response => {
    if (!response.ok) {
      const errorText = await response.text()
      const message = `Error ${response.status}: ${response.statusText}\nResponse: ${errorText}`
      res.status = response.status
      res.send = message
      throw new Error(message)
    }
    return response.json()
  }).then(data => data).catch(error => console.error('Fetch error:', error.message))
  // console.log(request, 'línea 488')

  if (request) {
    // const preferences = {
    //   clientId: null,
    //   name: null,
    //   iniTimeout: null,
    //   lastDate: ticket['max-uses-days'] ? ticket['max-uses-days'] : null,
    //   tolerance: ticket['advertises-days'] ? ticket['advertises-days'] : null,
    //   maxBoots: ticket['max-boot'] ? ticket['max-boot'] : null,
    //   fInterval: ticket['check-interval'] ? ticket['check-interval'] : null,
    //   msgIT: null,
    //   msgBW: ticket?.messages ? ticket?.messages.advertise : null,
    //   msgBT: ticket?.messages ? ticket?.messages.block : null
    // }

    const preferences = request?.preference

    res = { status: 200, send: preferences }
  } else {
    res = { status: 406, send: { error: 'Project not found!' } }
  }

  return res
}

const updatePreferences = async (req, res = { status: 500, result: false }) => {
  const data = req?.body
  const projectId = ApiRxartSecure.projectId
  const idPref = data.deviceId ? data?.preferenceId : data?.id

  if (data.deviceId) {
    delete data?.preferenceId
  } else {
    delete data?.id
  }

  const fetch = (await import('node-fetch')).default

  const myHeaders = { Authorization: `Bearer ${ApiRxartSecure.bearerToken}`, projectId, idPref, 'Content-Type': 'application/json' }

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify(data)
  }

  const request = await fetch(`${ApiRxartSecure.url}/preferences`, requestOptions).then(async response => {
    if (!response.ok) {
      const errorText = await response.text()
      const message = `Error ${response.status}: ${response.statusText}\nResponse: ${errorText}`
      res.status = response.status
      res.send = message
      throw new Error(message)
    }
    return response.json()
  }).then(data => data).catch(error => console.error('Fetch error:', error.message))
  // console.log(request, 'línea 579')

  if (request) {
    res = { status: 200, result: true }
    return res
  }

  return res
}

const registerLicenseDevice = async (req, res = { status: 500, result: false }) => {
  try {
    const { deviceId, codeActivation, userId } = req?.body
    const projectId = ApiRxartSecure.projectId

    let user
    if (userId !== -1) user = await getUsers({ id: userId })

    if (!deviceId) {
      return {
        status: 400,
        send: { error: 'The deviceId is required to register a new license!' }
      }
    }

    if (!codeActivation) {
      return {
        status: 400,
        send: { error: 'The device fields are required!' }
      }
    }

    const fetch = (await import('node-fetch')).default

    const myHeaders = { Authorization: `Bearer ${ApiRxartSecure.bearerToken}`, projectId, 'Content-Type': 'application/json' }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        deviceId,
        codeActivation,
        projectId,
        user: userId !== -1 ? user.name : 'System'
      })
    }
    // console.log(requestOptions, 'línea 35')

    const json = {
      license: null,
      response: false,
      message: null
    }

    const request = await fetch(`${ApiRxartSecure.url}/license_activation`, requestOptions).then(async response => {
      if (!response.ok) {
        res.status = response.status
        const errorObject = await response.json()
        const message = errorObject.message
        throw new Error(message)
      }
      return response.json()
    }).then(data => data).catch(error => {
      if (res.status === 404) json.message = error.message
      console.error('Fetch error:', error.message)
    })
    // console.log(request, 'línea 648')
    // console.log(json, 'línea 649')

    if (request && request.status === 'success') {
      json.license = request?.license
      json.response = true
      res.status = 200
    }

    res.send = json

    return res
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  totalDevices,
  getDevices,
  getDevicesPixtech,
  setDevices,
  getLastTicket,
  updateStatus,
  getPreferencesClient,
  updatePreferencesClient,
  calculateUnlockCode,
  getPreferencesDevice,
  updatePreferencesDevice,
  getProject,
  updatePreferencesProject,
  getPreferences,
  updatePreferences,
  registerLicenseDevice
}
