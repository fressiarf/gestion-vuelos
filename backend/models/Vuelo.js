const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Vuelo = sequelize.define('Vuelo', {
  id_vuelo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_avion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_aeropuerto_origen: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_aeropuerto_destino: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numero_vuelo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  precio_base: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('programado', 'en_vuelo', 'aterrizado', 'cancelado'),
    allowNull: false,
    defaultValue: 'programado'
  }
}, {
  tableName: 'Vuelos',
  timestamps: true
});

module.exports = Vuelo;
