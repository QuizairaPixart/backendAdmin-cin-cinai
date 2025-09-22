const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const leases = psql.define('leases',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    organization: { type: DataTypes.STRING, allowNull: false },
    startDate: {
      type: DataTypes.DATEONLY
    },
    endDate: {
      type: DataTypes.DATEONLY
    },
    state: {
      type: DataTypes.STRING, defaultValue: 'created'
    }
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['organization']
      }
    ]
  }
)

module.exports = { leases }
