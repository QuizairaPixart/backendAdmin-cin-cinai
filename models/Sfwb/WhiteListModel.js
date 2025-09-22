const { sfwb } = require('../../db/db')
const { DataTypes } = require('sequelize')

const historyWhite = sfwb.define(
  'historyWhite',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    url: {
      type: DataTypes.TEXT
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    device: { type: DataTypes.STRING }
  },
  { timestamps: false }
)

const whiteList = sfwb.define(
  'whiteList',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    url: {
      type: DataTypes.TEXT
    },
    count: { type: DataTypes.INTEGER }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['url']
      }
    ],
    timestamps: false,
    hooks: {
      afterBulkCreate: async (white, options) => {
        await historyWhite.bulkCreate(options.list)
        return white
      }
    }
  }
)

module.exports = { whiteList, historyWhite }
