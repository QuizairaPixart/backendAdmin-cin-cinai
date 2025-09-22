const { sfwb } = require('../../db/db')
const { DataTypes } = require('sequelize')

const historyBlack = sfwb.define(
  'historyBlack',
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

const blackList = sfwb.define(
  'blackList',
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
    suspect: { type: DataTypes.BOOLEAN },
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
      afterBulkCreate: async (black, options) => {
        await historyBlack.bulkCreate(options.list)
        return black
      }
    }
  }
)

module.exports = { blackList, historyBlack }
