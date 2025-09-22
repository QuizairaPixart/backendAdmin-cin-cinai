const { sfwb } = require('../../db/db')
const { DataTypes } = require('sequelize')

const keywordsList = sfwb.define(
  'keywordsList',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    keyword: {
      type: DataTypes.TEXT
    },
    percent: { type: DataTypes.INTEGER },
    create: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['keyword']
      }
    ]
  }
)

module.exports = { keywordsList }
