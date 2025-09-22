const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const locations = psql.define('locations',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    lat: { type: DataTypes.DOUBLE },
    lon: { type: DataTypes.DOUBLE },
    acc: { type: DataTypes.DOUBLE },
    type: { type: DataTypes.STRING },
    place: { type: DataTypes.STRING },
    date: {
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

const trackings = psql.define('tracking',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    order_id: { type: DataTypes.BIGINT },
    tracking: { type: DataTypes.JSONB },
    date_order: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    date_finish: { type: DataTypes.DATE },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false

    }
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ['order_id']
      }
    ]
  }
)

module.exports = { locations, trackings }
