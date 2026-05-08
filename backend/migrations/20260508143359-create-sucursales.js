'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sucursales', {
      id_sucursal: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_aerolinea: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Aerolineas',
          key: 'id_aerolinea'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      id_aeropuerto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Aeropuertos',
          key: 'id_aeropuerto'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      nombre: {
        type: Sequelize.STRING(150),
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
    await queryInterface.dropTable('Sucursales');
  }
};
