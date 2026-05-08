'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Vuelos', {
      id_vuelo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_avion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Aviones',
          key: 'id_avion'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      id_aeropuerto_origen: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Aeropuertos',
          key: 'id_aeropuerto'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      id_aeropuerto_destino: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Aeropuertos',
          key: 'id_aeropuerto'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      numero_vuelo: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      precio_base: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      estado: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Vuelos');
  }
};
