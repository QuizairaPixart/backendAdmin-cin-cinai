const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const defaultThief = psql.define('defaultThief',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    default: { type: DataTypes.BOOLEAN },
    touch: { type: DataTypes.BOOLEAN },
    screen: { type: DataTypes.BOOLEAN },
    background: { type: DataTypes.BOOLEAN },
    /* usb: { type: DataTypes.BOOLEAN }, */
    alarm: { type: DataTypes.BOOLEAN },
    pass: { type: DataTypes.BOOLEAN },
    /* statusMessage: { type: DataTypes.BOOLEAN }, */
    messageTitle: { type: DataTypes.TEXT },
    messageBody: { type: DataTypes.TEXT },
    photo: { type: DataTypes.BOOLEAN },
    quality: { type: DataTypes.STRING },
    recursive: { type: DataTypes.BOOLEAN },
    timeImage: { type: DataTypes.INTEGER },
    email: { type: DataTypes.STRING },
    statusTracking: { type: DataTypes.BOOLEAN },
    timeRequest: { type: DataTypes.INTEGER },
    timeTracking: { type: DataTypes.INTEGER },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false
  }
)

module.exports = { defaultThief }
