const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')
const { actions, thief } = require('./ActionsModel')
const { applications } = require('./ApplicationsModel')
const { appUseTimes, allAppUseMetrics } = require('./AppUseTimesModel')
const { completed } = require('./CompletedModel')
const { commands } = require('./CommandsModel')
const { configGeofence } = require('./ConfigGeofenceModel')
const { defaultThief } = require('./DefaultThiefModel')
const { devices, connections } = require('./DeviceModel')
const { geofences } = require('./GeofenceModel')
const { groups } = require('./GroupsModel')
const { locations, trackings } = require('./LocationsModel')
const { logs } = require('./LogsModel')
const { preferences, serverPreferences, useTimes } = require('./PreferenceModel')
const { preferencesReports, lossReports } = require('./ReportsModel')
const { stats } = require('./StatsModel')
const { users } = require('./UsersModel')
const { roles } = require('./RolesModel')
const { denunciations } = require('./DenunciationModel')
const { missingDevices } = require('./MissingDevicesModel')
const { deviceUseTimes } = require('./DeviceUseTimesModel')
const { notifications } = require('./NotificationsModel')
const { leases } = require('./LeasesModel')
const { events } = require('./EventsModel')
const { establishments } = require('./EstablishmentsModel')

const devicesActions = psql.define('devicesActions',
  {
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    actionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false

  }
)

const devicesApplication = psql.define('devicesApplication',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: true,
      autoIncrement: true
    },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ['deviceId', 'id']
      }
    ]
  }
)

const devicesGroup = psql.define('devicesGroups',
  {
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false

  }
)

const geofencesGroup = psql.define('geofencesGroups',
  {
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    geofenceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false

  }
)

const groupsActions = psql.define('groupsActions',
  {
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    actionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false

  }
)

const usersGroup = psql.define('usersGroup',
  {
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false

  }
)

const usersRole = psql.define(
  'usersRole',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: true,
      autoIncrement: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ['userId', 'id']
      }
    ]
  }
)

// ? asociasiones

// * una a una
actions.hasOne(completed)
actions.hasOne(lossReports)
completed.hasOne(lossReports)
devices.hasOne(logs)
devices.hasOne(stats)
groups.hasOne(preferences)
groups.hasOne(leases)
defaultThief.hasOne(preferences)
preferencesReports.hasOne(preferences)
serverPreferences.hasOne(preferences)
useTimes.hasOne(preferences)
thief.hasOne(lossReports)
trackings.hasOne(lossReports)
users.hasOne(lossReports)
denunciations.hasOne(lossReports)

completed.belongsTo(actions)
logs.belongsTo(devices)
stats.belongsTo(devices)
preferences.belongsTo(groups)
leases.belongsTo(groups)
preferences.belongsTo(defaultThief)
preferences.belongsTo(preferencesReports)
preferences.belongsTo(serverPreferences)
preferences.belongsTo(useTimes)
lossReports.belongsTo(actions)
lossReports.belongsTo(thief)
lossReports.belongsTo(completed)
lossReports.belongsTo(trackings)
lossReports.belongsTo(users)
lossReports.belongsTo(denunciations)

// * uno a muchos

applications.hasMany(allAppUseMetrics)
applications.hasMany(appUseTimes)
devices.hasMany(completed)
devices.hasMany(deviceUseTimes)
devices.hasMany(commands)
devices.hasMany(connections)
devices.hasMany(notifications)
devices.hasMany(locations)
devices.hasMany(events)
devices.hasMany(thief)
devices.hasMany(trackings)
devices.hasMany(lossReports)
devices.hasMany(denunciations)
establishments.hasMany(devices)
users.hasMany(denunciations, { foreignKey: 'userId', as: 'denunciations' })
users.hasMany(denunciations, { foreignKey: 'closeUserId', as: 'closedDenunciations' })
devices.hasMany(missingDevices)
users.hasMany(missingDevices, { foreignKey: 'userId', as: 'missingDevices' })
users.hasMany(missingDevices, { foreignKey: 'closeUserId', as: 'closedMissingDevices' })
configGeofence.hasMany(geofences)

geofences.belongsTo(configGeofence)
allAppUseMetrics.belongsTo(applications)
appUseTimes.belongsTo(applications)
deviceUseTimes.belongsTo(devices)
completed.belongsTo(devices)
commands.belongsTo(devices)
connections.belongsTo(devices)
notifications.belongsTo(devices)
locations.belongsTo(devices)
events.belongsTo(devices)
thief.belongsTo(devices)
lossReports.belongsTo(devices)
trackings.belongsTo(devices)
denunciations.belongsTo(devices)
devices.belongsTo(establishments, { foreignKey: 'establishmentId' })
denunciations.belongsTo(users, { foreignKey: 'userId', as: 'user' })
denunciations.belongsTo(users, { foreignKey: 'closeUserId', as: 'closeUser' })
missingDevices.belongsTo(devices)
missingDevices.belongsTo(users, { foreignKey: 'userId', as: 'userMissingDevices' })
missingDevices.belongsTo(users, { foreignKey: 'closeUserId', as: 'closeUserMissingDevices' })

// * muchos a muchos
actions.belongsToMany(devices, { through: devicesActions })
devices.belongsToMany(actions, { through: devicesActions })
devicesActions.belongsTo(actions)

actions.belongsToMany(groups, { through: groupsActions })
groups.belongsToMany(actions, { through: groupsActions })
groupsActions.belongsTo(actions)

applications.belongsToMany(devices, { through: devicesApplication, timestamps: false })
devices.belongsToMany(applications, { through: devicesApplication, timestamps: false })

groups.belongsToMany(devices, { through: devicesGroup })
devices.belongsToMany(groups, { through: devicesGroup })

groups.belongsToMany(geofences, { through: geofencesGroup, timestamps: false })
geofences.belongsToMany(groups, { through: geofencesGroup, timestamps: false })

groups.belongsToMany(users, { through: usersGroup, timestamps: false })
users.belongsToMany(groups, { through: usersGroup, timestamps: false })

roles.belongsToMany(users, { through: usersRole, timestamps: false })
users.belongsToMany(roles, { through: usersRole, timestamps: false })

module.exports = {
  devicesActions,
  devicesApplication,
  devicesGroup,
  groupsActions,
  usersGroup,
  usersRole,
  geofencesGroup
}
