const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Pago = sequelize.define('Pago', {
  id_pago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_reserva: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  metodo_pago: {
    type: DataTypes.ENUM('tarjeta', 'transferencia', 'efectivo'),
    allowNull: false
  },
  estado_pago: {
    type: DataTypes.ENUM('pendiente', 'completado', 'fallido'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  fecha_transaccion: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'Pagos',
  timestamps: true
});
module.exports = Pago;
