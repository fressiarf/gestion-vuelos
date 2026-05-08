const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Reserva = sequelize.define('Reserva', {
  id_reserva: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_vuelo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_sucursal: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  codigo_reserva: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estado_reserva: {
    type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada'),
    allowNull: false,
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'Reservas',
  timestamps: true,
  hooks: {
    beforeCreate: (reserva, options) => {
      if (!reserva.codigo_reserva) {
        const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
        reserva.codigo_reserva = `RES-${randomString}`;
      }
    }
  }
});
module.exports = Reserva;
