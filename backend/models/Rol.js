const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Rol = sequelize.define('Rol', {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre_rol: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  permisos: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'Roles',
  timestamps: true
});
module.exports = Rol;
