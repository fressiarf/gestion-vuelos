'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pagos', {
      id_pago: {
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
      monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      metodo_pago: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      estado_pago: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      fecha_transaccion: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('Pagos');
  }
};
