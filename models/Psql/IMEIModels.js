const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')
const serialsImei = psql.define(
  'serialsImei',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    serial_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    IMEI: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['serial_number']
      }
    ]
  }
)

module.exports = { serialsImei }
