const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Avion = sequelize.define('Avion', {
  id_avion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_aerolinea: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  matricula: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  }
}, {
  tableName: 'Aviones',
  timestamps: true
});
module.exports = Avion;
