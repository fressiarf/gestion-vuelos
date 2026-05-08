const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Tripulacion = sequelize.define('Tripulacion', {
  id_tripulacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_vuelo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  cargo: {
    type: DataTypes.STRING(80),
    allowNull: false
  }
}, {
  tableName: 'Tripulacion',
  timestamps: true
});

module.exports = Tripulacion;
