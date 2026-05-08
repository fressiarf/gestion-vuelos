const sequelize = require('../config/config');

// Importar todos los models
const Rol = require('./Rol');
const Aerolinea = require('./Aerolinea');
const Aeropuerto = require('./Aeropuerto');
// NOTA: Estos modelos deben ser creados antes de ejecutar este archivo para evitar errores de importación
const Usuario = require('./Usuario');
const Avion = require('./Avion');
const Sucursal = require('./Sucursal');
const Vuelo = require('./Vuelo');
const Tripulacion = require('./Tripulacion');
const Reserva = require('./Reserva');
const Pago = require('./Pago');
const Equipaje = require('./Equipaje');
const Notificacion = require('./Notificacion');

// Definir TODAS las asociaciones del sistema completo

Rol.hasMany(Usuario, { foreignKey: 'id_rol' });
Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });

Aerolinea.hasMany(Avion, { foreignKey: 'id_aerolinea' });
Avion.belongsTo(Aerolinea, { foreignKey: 'id_aerolinea' });

Aerolinea.hasMany(Sucursal, { foreignKey: 'id_aerolinea' });
Sucursal.belongsTo(Aerolinea, { foreignKey: 'id_aerolinea' });

Aeropuerto.hasMany(Sucursal, { foreignKey: 'id_aeropuerto' });
Sucursal.belongsTo(Aeropuerto, { foreignKey: 'id_aeropuerto' });

Aeropuerto.hasMany(Vuelo, { foreignKey: 'id_aeropuerto_origen', as: 'vuelos_origen' });
Aeropuerto.hasMany(Vuelo, { foreignKey: 'id_aeropuerto_destino', as: 'vuelos_destino' });
Vuelo.belongsTo(Aeropuerto, { foreignKey: 'id_aeropuerto_origen', as: 'aeropuerto_origen' });
Vuelo.belongsTo(Aeropuerto, { foreignKey: 'id_aeropuerto_destino', as: 'aeropuerto_destino' });

Avion.hasMany(Vuelo, { foreignKey: 'id_avion' });
Vuelo.belongsTo(Avion, { foreignKey: 'id_avion' });

Vuelo.hasMany(Tripulacion, { foreignKey: 'id_vuelo' });
Tripulacion.belongsTo(Vuelo, { foreignKey: 'id_vuelo' });

Vuelo.hasMany(Reserva, { foreignKey: 'id_vuelo' });
Reserva.belongsTo(Vuelo, { foreignKey: 'id_vuelo' });

Usuario.hasMany(Reserva, { foreignKey: 'id_usuario' });
Reserva.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Sucursal.hasMany(Reserva, { foreignKey: 'id_sucursal' });
Reserva.belongsTo(Sucursal, { foreignKey: 'id_sucursal' });

Reserva.hasMany(Pago, { foreignKey: 'id_reserva' });
Pago.belongsTo(Reserva, { foreignKey: 'id_reserva' });

Reserva.hasMany(Equipaje, { foreignKey: 'id_reserva' });
Equipaje.belongsTo(Reserva, { foreignKey: 'id_reserva' });

Usuario.hasMany(Notificacion, { foreignKey: 'id_usuario' });
Notificacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Exportar la instancia y todos los modelos
module.exports = {
  sequelize,
  Rol,
  Aerolinea,
  Aeropuerto,
  Usuario,
  Avion,
  Sucursal,
  Vuelo,
  Tripulacion,
  Reserva,
  Pago,
  Equipaje,
  Notificacion
};
