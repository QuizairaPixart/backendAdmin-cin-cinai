const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const roles = psql.define('roles',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    roleName: {
      type: DataTypes.STRING
    },
    homePage: {
      type: DataTypes.JSONB
    },
    devicesPage: {
      type: DataTypes.JSONB
    },
    dashboardDevicePage: {
      type: DataTypes.JSONB
    },
    groupsPage: {
      type: DataTypes.JSONB
    },
    dashboardGroupPage: {
      type: DataTypes.JSONB
    },
    usersPage: {
      type: DataTypes.JSONB
    },
    preferencesSettingsPage: {
      type: DataTypes.JSONB
    },
    preferencesReportsPage: {
      type: DataTypes.JSONB
    },
    preferencesLossesPage: {
      type: DataTypes.JSONB
    },
    preferencesUseTimePage: {
      type: DataTypes.JSONB
    },
    preferencesGeofencePage: {
      type: DataTypes.JSONB
    },
    preferencesRxartSecurePage: {
      type: DataTypes.JSONB
    },
    preferencesServerPage: {
      type: DataTypes.JSONB
    },
    preferencesAgentPage: {
      type: DataTypes.JSONB
    },
    geofencesPage: {
      type: DataTypes.JSONB
    },
    rolesPage: {
      type: DataTypes.JSONB
    },
    applicationsPage: {
      type: DataTypes.JSONB
    },
    safeWebHomePage: {
      type: DataTypes.JSONB
    },
    safeWebListsPage: {
      type: DataTypes.JSONB
    },
    safeWebWordsPage: {
      type: DataTypes.JSONB
    },
    safeWebPreferencesPage: {
      type: DataTypes.JSONB
    },
    reportsPage: {
      type: DataTypes.JSONB
    },
    softwareEventsPage: {
      type: DataTypes.JSONB
    },
    devicesEventsPage: {
      type: DataTypes.JSONB
    },
    establishmentsPage: {
      type: DataTypes.JSONB
    }
  },
  {
    timestamps: false
  }
)

module.exports = { roles }
