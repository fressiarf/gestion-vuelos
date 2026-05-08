const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Aerolinea = sequelize.define('Aerolinea', {
  id_aerolinea: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  codigo_iata: {
    type: DataTypes.CHAR(2),
    allowNull: false
  }
}, {
  tableName: 'Aerolineas',
  timestamps: true
});
module.exports = Aerolinea;
