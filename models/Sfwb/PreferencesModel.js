const { sfwb } = require('../../db/db')
const { DataTypes } = require('sequelize')
const { preferences } = require('../Psql/PreferenceModel')
// const { preferences } = require("../Psql/PreferenceModel");

const sfwbPreferences = sfwb.define(
  'sfwbPreferences',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    responseDefault: { type: DataTypes.BOOLEAN },
    blackList: { type: DataTypes.BOOLEAN },
    whiteList: { type: DataTypes.BOOLEAN },
    keyWords: { type: DataTypes.BOOLEAN },
    historyDays: { type: DataTypes.INTEGER },
    preferenceId: {
      type: DataTypes.INTEGER,
      references: {
        model: preferences,
        key: 'id',
        allowNull: false
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  },
  { timestamps: false }
)

module.exports = { sfwbPreferences }
