'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reservas', {
      id_reserva: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id_usuario'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      id_vuelo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Vuelos',
          key: 'id_vuelo'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      id_sucursal: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Sucursales',
          key: 'id_sucursal'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      codigo_reserva: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false
      },
      estado_reserva: {
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
    await queryInterface.dropTable('Reservas');
  }
};
