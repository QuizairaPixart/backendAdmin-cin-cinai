const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const preferences = psql.define('preferences',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    time_connection: { type: DataTypes.INTEGER },
    time_persistence: { type: DataTypes.INTEGER },
    time_off_line_disconnection: { type: DataTypes.INTEGER },
    timeouts: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
    use_other: { type: DataTypes.BOOLEAN },
    use_google: { type: DataTypes.BOOLEAN },
    stats: { type: DataTypes.BOOLEAN },
    applications: { type: DataTypes.BOOLEAN },
    lockApps: { type: DataTypes.ARRAY(DataTypes.STRING) },
    time_location: { type: DataTypes.INTEGER },
    url_google: { type: DataTypes.STRING },
    key_google: { type: DataTypes.STRING },
    user_id: { type: DataTypes.INTEGER },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    defaultThiefId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    preferencesReportId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    serverPreferenceId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    useTimeId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    timestamps: false
  }
)

const serverPreferences = psql.define('server_preferences',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    url_secondary: { type: DataTypes.STRING },
    Ws_url: { type: DataTypes.STRING },
    SafeWeb_url: { type: DataTypes.ARRAY(DataTypes.STRING) },
    Rxart_Secure: { type: DataTypes.ARRAY(DataTypes.STRING) },
    max_licences: { type: DataTypes.INTEGER },
    project_end_date: { type: DataTypes.DATEONLY }
  },
  {
    timestamps: false
  }
)

const useTimes = psql.define('use_time',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    start_time: { type: DataTypes.STRING },
    end_time: { type: DataTypes.STRING },
    days_id: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
    active_use_time: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  {
    timestamps: false
  }
)

module.exports = { preferences, serverPreferences, useTimes }
