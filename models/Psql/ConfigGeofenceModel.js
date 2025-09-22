const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const configGeofence = psql.define('configGeofence',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    checkEmail: { type: DataTypes.BOOLEAN, defaultValue: false },
    checkSms: { type: DataTypes.BOOLEAN, defaultValue: false },
    notifications: { type: DataTypes.STRING, defaultValue: 'Inmediatas' },
    sendMsg: { type: DataTypes.STRING, defaultValue: '' },
    activeDevice: { type: DataTypes.BOOLEAN, defaultValue: false },
    activeNetwork: { type: DataTypes.BOOLEAN, defaultValue: false },
    powerOffDevice: { type: DataTypes.BOOLEAN, defaultValue: false },
    selectDate: { type: DataTypes.STRING, defaultValue: 'Día' },
    exportData: { type: DataTypes.BOOLEAN, defaultValue: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    timestamps: false
  }
)

module.exports = { configGeofence }
