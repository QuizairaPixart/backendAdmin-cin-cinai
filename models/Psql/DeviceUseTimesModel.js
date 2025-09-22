const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const deviceUseTimes = psql.define('deviceUseTimes',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    totalTimeSeconds: {
      type: DataTypes.INTEGER
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    timestamps: false
  }
)

const allDevicesUseMetrics = psql.define('allDevicesUseMetrics',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    totalTimeSeconds: {
      type: DataTypes.INTEGER
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    count: {
      type: DataTypes.INTEGER
    }
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ['date']
      }
    ]
  }
)

module.exports = { deviceUseTimes, allDevicesUseMetrics }
