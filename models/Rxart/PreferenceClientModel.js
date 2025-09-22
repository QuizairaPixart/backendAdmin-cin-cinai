const { rxartPsql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const preferencesClient = rxartPsql.define('preferencesClient',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    clientId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    iniTimeout: { type: DataTypes.INTEGER },
    lastDate: { type: DataTypes.INTEGER },
    tolerance: { type: DataTypes.INTEGER },
    maxBoots: { type: DataTypes.INTEGER },
    fInterval: { type: DataTypes.INTEGER },
    msgIT: { type: DataTypes.TEXT },
    msgBW: { type: DataTypes.TEXT },
    msgBT: { type: DataTypes.TEXT }
  },
  {
    timestamps: false
  }
)

module.exports = { preferencesClient }
