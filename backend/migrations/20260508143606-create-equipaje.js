'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Equipaje', {
      id_equipaje: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_reserva: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Reservas',
          key: 'id_reserva'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      peso_kg: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false
      },
      tipo_maleta: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      costo_adicional: {
        type: Sequelize.DECIMAL(10, 2),
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
    await queryInterface.dropTable('Equipaje');
  }
};
