const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const stats = psql.define('stats',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    Ram: {
      type: DataTypes.JSONB
    },
    Disk: {
      type: DataTypes.JSONB
    },
    Battery: {
      type: DataTypes.JSONB
    },
    countOverRam: {
      type: DataTypes.INTEGER
    },
    countOverDisk: {
      type: DataTypes.INTEGER
    },
    countOverBattery: {
      type: DataTypes.INTEGER
    },
    checkAlert: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    last_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
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

const allStatsMetrics = psql.define('allStatsMetrics',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    Ram: {
      type: DataTypes.JSONB
    },
    Disk: {
      type: DataTypes.JSONB
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false
  }
)

module.exports = { stats, allStatsMetrics }
