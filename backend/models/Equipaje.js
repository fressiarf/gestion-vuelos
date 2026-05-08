const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Equipaje = sequelize.define('Equipaje', {
  id_equipaje: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_reserva: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  peso_kg: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false
  },
  tipo_maleta: {
    type: DataTypes.ENUM('de_mano', 'bodega'),
    allowNull: false
  },
  costo_adicional: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  }
}, {
  tableName: 'Equipaje',
  timestamps: true
});
module.exports = Equipaje;
