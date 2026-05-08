const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Notificacion = sequelize.define('Notificacion', {
  id_notificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  leido: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Notificaciones',
  timestamps: true
});

module.exports = Notificacion;
