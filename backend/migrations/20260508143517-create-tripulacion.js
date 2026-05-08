'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tripulacion', {
      id_tripulacion: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      cargo: {
        type: Sequelize.STRING(80),
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
    await queryInterface.dropTable('Tripulacion');
  }
};
