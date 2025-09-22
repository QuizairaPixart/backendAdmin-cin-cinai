const clientPSQL = require('../../Databases/CRUD-Client')
const { deleteLease } = require('../../Databases/CRUD-Leases')
const { deletePreference, deleteDefaultThief } = require('../../Databases/CRUD-Preferences')

const getGroups = async (id, req) => {
  const userId = JSON.parse(req.headers.authorization).userId
  let groups = { error: true }

  if (userId) {
    if (req.params.id) {
      groups = await clientPSQL.readGroup(id)
    } else {
      groups = await clientPSQL.readGroup(null, null)
    }
  }

  if (id) {
    groups = await clientPSQL.readGroup(id)
  }

  return groups
}

const getGroupPreferences = async (id, table = null, req) => {
  let groups = { error: true }

  if (id) {
    groups = await clientPSQL.readGroup(id, table)
  }

  return groups
}

const postGroups = async (data) => {
  const existGroup = await clientPSQL.readGroup({ name: data.name })
  if (existGroup) {
    return { result: false }
  }
  // creacion de rows
  const groups = await clientPSQL.createGroup(data) // group
  if (groups) {
    // asociaciones
    if (data.users && data.users.length !== 0) {
      for (const userId of data.users) {
        try {
          await groups.addUsers(userId)
        } catch (e) {
          console.error('addUserGroup ', e)
        }
      }
    }
    if (data.devices && data.devices.length !== 0) {
      for (const deviceId of data.devices) {
        try {
          await groups.addDevices(deviceId)
        } catch (e) {
          console.error('addDevicesGroup ', e)
        }
      }
    }
    if (data.geofences && data.geofences.length !== 0) {
      for (const geofenceId of data.geofences) {
        try {
          await groups.addGeofences(geofenceId)
        } catch (e) {
          console.error('addGeofencesGroup ', e)
        }
      }
    }

    return { result: true, groups }
  }
}

const putGroups = async (id, data) => {
  if (!data.name) {
    return { result: null, name: null }
  }
  let groups = await clientPSQL.readGroup(id)

  if (groups) {
    if (data.name !== groups.name) {
      const existGroup = await clientPSQL.readGroup({ name: data.name })
      if (existGroup) {
        return { result: false, name: false }
      }
    }
    const usersDB = groups.users ? groups.users.sort() : []
    const users = data.users ? data.users.sort() : []

    if (
      usersDB.length !== users.length ||
      usersDB.every((value, index) => {
        return value.id !== users[index].id
      })
    ) {
      if (usersDB.length !== 0) {
        for (const userId of usersDB) {
          try {
            await groups.removeUsers(userId.id)
          } catch (e) {
            console.error('removeUserGroup ', e)
          }
        }
      }
      if (users.length !== 0) {
        for (const userId of data.users) {
          try {
            await groups.addUsers(userId.id)
          } catch (e) {
            console.error('adduserGroup ', e)
          }
        }
      }
    }
    const deviceDB = groups.devices ? groups.devices.sort() : []
    const devices = data.devices ? data.devices.sort() : []

    if (
      deviceDB.length !== devices.length ||
      deviceDB.every((value, index) => {
        return value.id !== devices[index].id
      })
    ) {
      if (deviceDB.length !== 0) {
        for (const deviceId of deviceDB) {
          try {
            await groups.removeDevices(deviceId.id)
          } catch (e) {
            console.error('removeDeviceGroups ', e)
          }
        }
      }
      if (devices.length !== 0) {
        for (const deviceId of data.devices) {
          try {
            await groups.addDevices(deviceId.id)
          } catch (e) {
            console.error('addDevicesGroup ', e)
          }
        }
      }
    }

    const geofencesDB = groups.geofences ? groups.geofences.sort() : []
    const geofences = data.geofences ? data.geofences.sort() : []

    if (
      geofencesDB.length !== geofences.length ||
      geofencesDB.every((value, index) => {
        return value.id !== geofences[index].id
      })
    ) {
      if (geofencesDB.length !== 0) {
        for (const geofenceId of geofencesDB) {
          try {
            await groups.removeGeofences(geofenceId.id)
          } catch (e) {
            console.error('removeGeofenceGroups ', e)
          }
        }
      }
      if (geofences.length !== 0) {
        for (const geofenceId of data.geofences) {
          try {
            await groups.addGeofences(geofenceId.id)
          } catch (e) {
            console.error('addGeofencesGroup ', e)
          }
        }
      }
    }
  } else {
    return { result: null, id: null }
  }
  groups = await clientPSQL.updateGroup(id, data)
  return groups
}
const deleteGroups = async (id) => {
  const thiefDefault = await deletePreference(id)
  const preferencesGroup = await deleteDefaultThief(id)
  await deleteLease({ groupId: id.id })
  const groups = await clientPSQL.deleteGroup(id)
  if ((thiefDefault, preferencesGroup, groups)) {
    return { result: true }
  }
}
module.exports = { getGroups, getGroupPreferences, postGroups, putGroups, deleteGroups }
