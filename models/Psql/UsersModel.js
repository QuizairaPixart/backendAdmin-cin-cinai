const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const users = psql.define('users',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING },
    last: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull: false },
    range: { type: DataTypes.INTEGER, allowNull: false },
    geo_id: { type: DataTypes.INTEGER },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    session_id: { type: DataTypes.STRING }
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user', 'email']
      }
    ]
  }
)

module.exports = { users }
