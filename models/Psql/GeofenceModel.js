const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const geofences = psql.define('geofences',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING, defaultValue: 'aun no disponible' },
    description: { type: DataTypes.TEXT, defaultValue: 'aun no disponible' },
    type: { type: DataTypes.STRING, defaultValue: 'Salida' },
    lat: { type: DataTypes.DOUBLE },
    lon: { type: DataTypes.DOUBLE },
    place: { type: DataTypes.STRING },
    area: { type: DataTypes.BIGINT },
    color_range: { type: DataTypes.STRING },
    date_order: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    configGeofenceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ['name']
      },
      {
        unique: true,
        fields: ['lat', 'lon']
      }
    ]
  }
)

module.exports = { geofences }
