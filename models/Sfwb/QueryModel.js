const { sfwb } = require('../../db/db')
const { DataTypes } = require('sequelize')

const historyQuery = sfwb.define(
  'historyQuery',
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

const queryList = sfwb.define(
  'queryList',
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
      afterBulkCreate: async (query, options) => {
        await historyQuery.bulkCreate(options.list)
        return query
      }
    }
  }
)

module.exports = { queryList, historyQuery }
