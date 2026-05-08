'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Crear Roles
    await queryInterface.bulkInsert('Roles', [
      {
        nombre_rol: 'admin',
        permisos: 'all',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre_rol: 'cliente',
        permisos: 'read,reserve',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // 2. Crear Usuario Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('Usuarios', [
      {
        id_rol: 1, // Asumiendo que el ID 1 es Admin
        email: 'admin@vuelos.com',
        password: hashedPassword,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // 3. Crear Aerolineas
    await queryInterface.bulkInsert('Aerolineas', [
      {
        nombre: 'Avianca',
        codigo_iata: 'AV',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'LATAM',
        codigo_iata: 'LA',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // 4. Crear Aeropuertos
    await queryInterface.bulkInsert('Aeropuertos', [
      {
        nombre: 'El Dorado',
        codigo_iata: 'BOG',
        ciudad: 'Bogotá',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'José María Córdova',
        codigo_iata: 'MDE',
        ciudad: 'Medellín',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // 5. Crear Aviones (Obligatorio antes del vuelo)
    await queryInterface.bulkInsert('Aviones', [
      {
        id_aerolinea: 1, // Avianca
        matricula: 'HK-5321',
        capacidad: 180,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // 6. Crear Vuelo Programado
    await queryInterface.bulkInsert('Vuelos', [
      {
        id_avion: 1,
        id_aeropuerto_origen: 1, // BOG
        id_aeropuerto_destino: 2, // MDE
        numero_vuelo: 'AV9345',
        precio_base: 150000.00,
        estado: 'programado',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir en orden inverso para no romper restricciones de llaves foráneas (FK)
    await queryInterface.bulkDelete('Vuelos', null, {});
    await queryInterface.bulkDelete('Aviones', null, {});
    await queryInterface.bulkDelete('Aeropuertos', null, {});
    await queryInterface.bulkDelete('Aerolineas', null, {});
    await queryInterface.bulkDelete('Usuarios', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
