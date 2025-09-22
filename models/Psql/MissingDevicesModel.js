const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const missingDevices = psql.define('missingDevices',
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
    },
    status: { type: DataTypes.STRING, defaultValue: 'open' },
    userId: { type: DataTypes.INTEGER },
    closeDate: { type: DataTypes.DATE },
    closeUserId: { type: DataTypes.INTEGER }
  },
  {
    timestamps: true
  }
)

module.exports = { missingDevices }
