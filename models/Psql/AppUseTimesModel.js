const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const appUseTimes = psql.define('appUseTimes',
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
      type: DataTypes.DATEONLY
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: true
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

const allAppUseMetrics = psql.define('allAppUseMetrics',
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
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
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
        fields: ['applicationId', 'date']
      },
      {
        unique: false,
        fields: ['date']
      }
    ]
  }
)

module.exports = { appUseTimes, allAppUseMetrics }
