const { psql } = require('../../db/db')
const { DataTypes } = require('sequelize')

const establishments = psql.define('establishments',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    level: { type: DataTypes.STRING },
    region: { type: DataTypes.STRING },
    localOffice: { type: DataTypes.STRING },
    code: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    lon: { type: DataTypes.DOUBLE },
    lat: { type: DataTypes.DOUBLE },
    type: { type: DataTypes.STRING },
    district: { type: DataTypes.STRING },
    corner: { type: DataTypes.BOOLEAN, defaultValue: false },
    classrooms: { type: DataTypes.INTEGER },
    multifunctionalPrinter: { type: DataTypes.INTEGER },
    type1computer: { type: DataTypes.INTEGER },
    type2computer: { type: DataTypes.INTEGER },
    type3computer: { type: DataTypes.INTEGER },
    tablet: { type: DataTypes.INTEGER },
    screen: { type: DataTypes.INTEGER },
    cabinet: { type: DataTypes.INTEGER }
  },
  {
    timestamps: false
  }
)

module.exports = { establishments }
