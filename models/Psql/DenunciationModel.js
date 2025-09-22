const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const denunciations = psql.define('denunciations',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    denunciationStatus: { type: DataTypes.STRING, defaultValue: 'open' },
    denunciationNumber: { type: DataTypes.STRING },
    denunciationDate: { type: DataTypes.DATEONLY },
    incidentDate: { type: DataTypes.DATEONLY },
    recoveryDate: { type: DataTypes.DATEONLY },
    investigator: { type: DataTypes.STRING },
    file: { type: DataTypes.STRING },
    fileExtension: { type: DataTypes.STRING },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: { type: DataTypes.INTEGER },
    closeDate: { type: DataTypes.DATE },
    closeUserId: { type: DataTypes.INTEGER }
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ['denunciationNumber']
      }
    ]
  }
)

module.exports = { denunciations }
