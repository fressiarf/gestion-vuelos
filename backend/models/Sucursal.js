const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Sucursal = sequelize.define('Sucursal', {
  id_sucursal: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_aerolinea: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_aeropuerto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  }
}, {
  tableName: 'Sucursales',
  timestamps: true
});
module.exports = Sucursal;
