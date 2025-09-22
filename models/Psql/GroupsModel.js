const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const groups = psql.define('groups',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: { type: DataTypes.STRING },
    visible: { type: DataTypes.BOOLEAN },
    type: { type: DataTypes.STRING, defaultValue: 'custom' },
    user_id: { type: DataTypes.INTEGER },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['name']
      }
    ]
  }
)

module.exports = { groups }
