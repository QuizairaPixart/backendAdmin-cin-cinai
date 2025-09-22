const { rxartPsql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const devices = rxartPsql.define('devices',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    deviceId: { type: DataTypes.STRING, unique: true },
    serialBios: { type: DataTypes.STRING, unique: true },
    statusId: { type: DataTypes.STRING },
    statusName: { type: DataTypes.STRING },
    currentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    validationDate: { type: DataTypes.DATE },
    bootCount: { type: DataTypes.INTEGER },
    deviceType: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    clientId: { type: DataTypes.INTEGER },
    osVersion: { type: DataTypes.STRING },
    model: { type: DataTypes.STRING }
  },
  {
    timestamps: false
  }
)

module.exports = { devices }
