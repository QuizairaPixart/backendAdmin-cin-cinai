const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const events = psql.define('events',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    type_event_id: { type: DataTypes.INTEGER },
    type: { type: DataTypes.STRING },
    data: { type: DataTypes.JSONB },
    date: { type: DataTypes.DATE },
    ip_wan: { type: DataTypes.STRING },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
)

module.exports = { events }
