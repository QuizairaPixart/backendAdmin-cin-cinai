const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const preferencesReports = psql.define('preferencesReports',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    reportsDays: {
      type: DataTypes.BOOLEAN
    },
    days: {
      type: DataTypes.INTEGER
    },
    overAlert: {
      type: DataTypes.BOOLEAN
    },
    percentRam: {
      type: DataTypes.INTEGER
    },
    percentDisk: {
      type: DataTypes.INTEGER
    },
    percentBattery: {
      type: DataTypes.INTEGER
    },
    emailUser: { type: DataTypes.STRING },
    emailKey: { type: DataTypes.STRING },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false
  }
)

const lossReports = psql.define('lossReports',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    order_id: { type: DataTypes.BIGINT },
    start_date: { type: DataTypes.DATE },
    finish_date: { type: DataTypes.DATE }
  },
  {
    timestamps: false
  }
)

module.exports = { preferencesReports, lossReports }
