const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const actions = psql.define('actions',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    action: { type: DataTypes.STRING },
    data: { type: DataTypes.JSONB },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }

)

const thief = psql.define('thief',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    identity: { type: DataTypes.STRING },
    order_id: { type: DataTypes.BIGINT },
    images: { type: DataTypes.ARRAY(DataTypes.STRING) },
    path: { type: DataTypes.STRING },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false

    }
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ['order_id', 'identity']
      }
    ]
  }
)

module.exports = { actions, thief }
