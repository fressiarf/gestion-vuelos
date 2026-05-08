const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'Usuarios',
  timestamps: true
});
module.exports = Usuario;
