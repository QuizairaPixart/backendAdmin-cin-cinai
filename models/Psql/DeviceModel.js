const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const devices = psql.define('devices',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    so: { type: DataTypes.STRING },
    id_processor: { type: DataTypes.STRING },
    model: { type: DataTypes.STRING },
    id_user: { type: DataTypes.STRING },
    id_rxart: { type: DataTypes.STRING },
    users_log: { type: DataTypes.INTEGER },
    name: { type: DataTypes.TEXT, defaultValue: 'Automático' },
    type: { type: DataTypes.STRING },
    agent_version: { type: DataTypes.STRING },
    serial_number: { type: DataTypes.STRING },
    mac: { type: DataTypes.STRING, defaultValue: 'aun no disponible' },
    IMEI: { type: DataTypes.STRING },
    status_lock: { type: DataTypes.BOOLEAN, defaultValue: false },
    motive_lock: { type: DataTypes.STRING },
    reported: { type: DataTypes.BOOLEAN, defaultValue: false },
    missing: { type: DataTypes.BOOLEAN, defaultValue: false },
    id_device: { type: DataTypes.STRING, defaultValue: 'aun no disponible' },
    identity: { type: DataTypes.STRING, allowNull: false },
    licence: { type: DataTypes.STRING },
    first_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    last_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ip_wan: { type: DataTypes.STRING },
    ssid: { type: DataTypes.STRING },
    gateway: { type: DataTypes.ARRAY(DataTypes.STRING) }
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['identity']
      },
      {
        unique: true,
        fields: ['licence']
      }
    ]
  }
)

const connections = psql.define('connections',
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
    ip_lan: { type: DataTypes.STRING },
    ip_wan: { type: DataTypes.STRING },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false

    }
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

const licences = psql.define('licences', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  licences: { type: DataTypes.STRING }

}, { timestamps: false })

const allConnectionsMetrics = psql.define('allConnectionsMetrics',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    deviceId: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER
    }
  },
  {
    timestamps: false
  }
)

module.exports = { devices, connections, licences, allConnectionsMetrics }
