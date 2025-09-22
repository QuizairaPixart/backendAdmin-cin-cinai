const { rxartPsql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const tickets = rxartPsql.define('tickets',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    deviceId: { type: DataTypes.STRING },
    ticketTime: { type: DataTypes.DATE },
    ticketType: { type: DataTypes.STRING },
    ticketTypeName: { type: DataTypes.STRING },
    callerip: { type: DataTypes.STRING }
  },
  {
    timestamps: false
  }
)

module.exports = { tickets }
