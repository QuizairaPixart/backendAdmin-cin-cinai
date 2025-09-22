const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')
const applications = psql.define('applications',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    app: {
      type: DataTypes.TEXT
    },
    uninstall: {
      type: DataTypes.TEXT
    },
    installPath: {
      type: DataTypes.TEXT
    },
    version: {
      type: DataTypes.TEXT
    },
    system: {
      type: DataTypes.BOOLEAN
    },
    groupApp: {
      type: DataTypes.INTEGER
    },
    last_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['uninstall']
      }
    ]
  }
)
module.exports = { applications }
