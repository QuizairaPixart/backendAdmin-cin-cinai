const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const logs = psql.define('logs',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    level: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    date: { type: DataTypes.ARRAY(DataTypes.DATE) },
    method: { type: DataTypes.ARRAY(DataTypes.STRING) },
    line: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
    message: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
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

const debugLogs = psql.define('debugLogs',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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

module.exports = { logs, debugLogs }
