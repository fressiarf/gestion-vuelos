const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Aeropuerto = sequelize.define('Aeropuerto', {
  id_aeropuerto: {
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
    type: DataTypes.CHAR(3),
    allowNull: false
  },
  ciudad: {
    type: DataTypes.STRING(120),
    allowNull: false
  }
}, {
  tableName: 'Aeropuertos',
  timestamps: true
});

module.exports = Aeropuerto;
