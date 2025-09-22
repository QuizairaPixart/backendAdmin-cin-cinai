const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const commands = psql.define('commands',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    command: { type: DataTypes.TEXT },
    response: { type: DataTypes.TEXT, defaultValue: 'aun no disponible' },
    dateCommand: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    dateResponse: { type: DataTypes.DATE },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    deviceId: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    timestamps: false
  }
)

module.exports = { commands }
