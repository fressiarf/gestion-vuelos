'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Aviones', {
      id_avion: {
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
      matricula: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      capacidad: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Aviones');
  }
};
