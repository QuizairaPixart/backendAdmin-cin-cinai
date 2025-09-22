const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const notifications = psql.define('notifications',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seen: { type: DataTypes.BOOLEAN, defaultValue: false },
    type: { type: DataTypes.STRING },
    data: { type: DataTypes.JSONB }
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ['date']
      }
    ]
  }
)

module.exports = { notifications }
