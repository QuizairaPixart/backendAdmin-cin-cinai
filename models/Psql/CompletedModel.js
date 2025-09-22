const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const completed = psql.define('completed',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    result: { type: DataTypes.TEXT },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    actionId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ['deviceId', 'actionId']
      }
    ]
  }
)

module.exports = { completed }
