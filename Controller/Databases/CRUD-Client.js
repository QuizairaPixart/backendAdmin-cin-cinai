const { users } = require('../../models/Psql/UsersModel')
const { groups } = require('../../models/Psql/GroupsModel')
const { SequelizeError } = require('../../middlewares/errors/AppError')

// create users
const createUser = async (data) => {
  try {
    let user = null
    if (data.geo_id) {
      data.geo_id = parseInt(data.geo_id)
    }
    data.range = parseInt(data.range)

    user = await users.create(data)
    if (user instanceof users) {
      console.log(`usuario ${user.id} creado con exito`)
      return user
    } else {
      return false
    }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read users
const readUser = async (id, table = { all: true }) => {
  try {
    let user
    if (id) {
      user = await users.findOne({ where: id, include: table })
    } else {
      user = await users.findAll({ where: id, include: table })
    }
    return user
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// update users
const updateUser = async (id, data) => {
  try {
    const user = await users.update(data, { where: id })
    if (user) return user
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// delete users
const deleteUser = async (id) => {
  try {
    const user = users.destroy({ where: id })
    if (user) {
      return { result: true }
    }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// GROUPS//
// create groups
const createGroup = async (data) => {
  try {
    const group = await groups.create(data)
    if (group instanceof groups) {
      console.log(`grupo ${group.id} creado con exito`)

      return group
    } else {
      return false
    }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read groups
const readGroup = async (id, tables = { all: true }) => {
  try {
    let group
    if (id !== null) {
      group = await groups.findOne({ where: id, include: tables /* [{ association: 'preference', include: tables }] */ })
    } else {
      group = await groups.findAll({ include: tables })
    }
    return group
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateGroup = async (id, data) => {
  try {
    const [numUpdated, updatedGroups] = await groups.update(data, {
      where: id,
      returning: true
    })

    if (numUpdated > 0) {
      const updatedGroup = updatedGroups[0]

      const groupWithDevices = await groups.findByPk(updatedGroup.id, {
        include: [{ association: 'devices' }]
      })

      if (groupWithDevices) return { result: true, groupWithDevices }
    }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateTypeGroup = async (id, data) => {
  try {
    const group = await groups.update(data, {
      where: id,
      returning: true
    })

    return group
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// delete groups
const deleteGroup = async (id) => {
  try {
    const group = await groups.destroy({ where: id })
    if (group) {
      return { result: true }
    }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const getAllGroups = async () => {
  try {
    let allGroups = null
    allGroups = await groups.findAll({
      include: [
        { association: 'devices' },
        {
          association: 'geofences',
          attributes: ['name', 'lat', 'lon', 'area', 'type'],
          include: [
            {
              association: 'configGeofence',
              attributes: ['sendMsg', 'activeNetwork', 'activeDevice', 'powerOffDevice']
            }
          ]
        }
      ]
    })

    if (allGroups.length > 0) allGroups = allGroups?.map(key => key?.toJSON())

    return allGroups
  } catch (error) {
    console.log('error en getAllGroups: ', { error })
  }
}

const getGeofencesGroup = async () => {
  try {
    const groups = await getAllGroups()
    const geofencesByLicence = {}

    groups?.forEach(group => {
      const devices = group?.devices
      const geofences = group?.geofences

      if (devices && devices.length > 0 && geofences && geofences.length > 0) {
        devices?.forEach(device => {
          const licence = device.licence

          if (!geofencesByLicence[licence]) {
            geofencesByLicence[licence] = {
              licence,
              geofences: []
            }
          }

          let geofencesOfDevice = geofences?.filter(geofence =>
            geofence.geofencesGroups.groupId === device.devicesGroups.groupId
          )

          geofencesOfDevice = geofencesOfDevice?.map(geofence => {
            const { configGeofence, geofencesGroups, ...rest } = geofence
            return { ...rest, preferences: configGeofence }
          })

          geofencesByLicence[licence].geofences = [...geofencesByLicence[licence].geofences, ...geofencesOfDevice]
        })
      }
    })

    const geofencesGroup = Object.values(geofencesByLicence)
    return geofencesGroup
  } catch (error) {
    console.log('error en getGeofencesGroup: ', { error })
  }
}

const getGeofencesOfDevices = async () => {
  try {
    const geofencesGroup = await getGeofencesGroup()

    if (geofencesGroup.length > 0) {
      for (const licenceGroup of geofencesGroup) {
        licenceGroup.geofences = licenceGroup?.geofences?.map(geofence => {
          const { preferences, ...rest } = geofence

          const newPreferences = {
            sendMessage: preferences?.sendMsg,
            networkConnection: preferences?.activeNetwork,
            lockDevice: preferences?.activeDevice,
            powerOff: preferences?.powerOffDevice
          }
          return { ...rest, preferences: newPreferences }
        })
      }
      return geofencesGroup
    } else {
      return { groups: [], geofences: [] }
    }
  } catch (error) {
    console.log('error en getGeofencesOfDevices: ', { error })
  }
}

module.exports = {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  createGroup,
  readGroup,
  updateGroup,
  updateTypeGroup,
  deleteGroup,
  getGeofencesOfDevices
}
