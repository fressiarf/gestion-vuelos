const { 
  sequelize, Reserva, Vuelo, Avion, Aeropuerto, 
  Pago, Equipaje, Notificacion, Sucursal, Usuario 
} = require('../models');

// Asumimos que el ID del Rol Administrador es 1.
const ADMIN_ROLE_ID = 1;

/**
 * Función 1: getMisReservas
 * Obtiene todas las reservas del usuario autenticado incluyendo detalles de vuelo, pago y equipaje.
 */
const getMisReservas = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario;

    const reservas = await Reserva.findAll({
      where: { id_usuario },
      include: [
        { 
          model: Vuelo,
          include: [
            { model: Aeropuerto, as: 'aeropuerto_origen' },
            { model: Aeropuerto, as: 'aeropuerto_destino' }
          ]
        },
        { model: Pago },
        { model: Equipaje }
      ]
    });

    res.status(200).json(reservas);
  } catch (error) {
    console.error('Error en getMisReservas:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener las reservas.' });
  }
};

/**
 * Función 2: getReservaById
 * Obtiene una reserva específica verificando que pertenezca al usuario que la solicita.
 */
const getReservaById = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario;
    const { id_reserva } = req.params;

    const reserva = await Reserva.findOne({
      where: { id_reserva, id_usuario },
      include: [
        { 
          model: Vuelo,
          include: [
            { model: Aeropuerto, as: 'aeropuerto_origen' },
            { model: Aeropuerto, as: 'aeropuerto_destino' },
            { model: Avion }
          ]
        },
        { model: Pago },
        { model: Equipaje },
        { model: Sucursal }
      ]
    });

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada o no pertenece a tu usuario.' });
    }

    res.status(200).json(reserva);
  } catch (error) {
    console.error('Error en getReservaById:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener la reserva.' });
  }
};

/**
 * Función 3: createReserva
 * Permite a un cliente crear una reserva validando disponibilidad y evitando race conditions con transacciones.
 */
const createReserva = async (req, res) => {
  // Iniciar la transacción para proteger la verificación de capacidad
  const t = await sequelize.transaction();

  try {
    // Regla: Solo clientes (no admins)
    if (req.usuario.id_rol === ADMIN_ROLE_ID) {
      await t.rollback();
      return res.status(403).json({ message: 'Los administradores no pueden crear reservas.' });
    }

    const id_usuario = req.usuario.id_usuario;
    const { id_vuelo, id_sucursal } = req.body;

    // Obtener vuelo con el avión asociado. 
    // Usamos LOCK.UPDATE para bloquear esta fila de vuelo mientras verificamos la capacidad.
    const vuelo = await Vuelo.findByPk(id_vuelo, {
      include: [{ model: Avion }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!vuelo) {
      await t.rollback();
      return res.status(404).json({ message: 'El vuelo especificado no existe.' });
    }

    // Verificar estado del vuelo
    if (vuelo.estado !== 'programado') {
      await t.rollback();
      return res.status(400).json({ message: 'Este vuelo no está disponible para reserva.' });
    }

    // Contar las reservas activas (pendientes y confirmadas)
    const reservasActivas = await Reserva.count({
      where: {
        id_vuelo,
        estado_reserva: ['pendiente', 'confirmada']
      },
      transaction: t
    });

    const capacidadAvion = vuelo.Avion.capacidad;

    // Verificar si hay capacidad
    if (reservasActivas >= capacidadAvion) {
      await t.rollback();
      return res.status(400).json({ message: 'Lo sentimos, no hay capacidad disponible en este vuelo.' });
    }

    // Crear la reserva. El hook beforeCreate generará automáticamente codigo_reserva
    const nuevaReserva = await Reserva.create({
      id_usuario,
      id_vuelo,
      id_sucursal: id_sucursal || null,
      fecha: new Date(),
      estado_reserva: 'pendiente'
    }, { transaction: t });

    // Crear la notificación vinculada a la nueva reserva
    await Notificacion.create({
      id_usuario,
      mensaje: `Tu reserva ${nuevaReserva.codigo_reserva} fue creada exitosamente`,
      leido: false
    }, { transaction: t });

    // Confirmar todos los cambios en BD
    await t.commit();

    res.status(201).json({
      message: 'Reserva creada exitosamente.',
      reserva: nuevaReserva
    });

  } catch (error) {
    // Revertir todo si falla algo
    await t.rollback();
    console.error('Error en createReserva:', error);
    res.status(500).json({ message: 'Error en el servidor al intentar crear la reserva.' });
  }
};

/**
 * Función 4: cancelarReserva
 * Permite a un cliente cancelar su propia reserva si está pendiente o confirmada.
 */
const cancelarReserva = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const id_usuario = req.usuario.id_usuario;
    const { id_reserva } = req.params;

    // Buscar y bloquear registro durante actualización
    const reserva = await Reserva.findOne({
      where: { id_reserva, id_usuario },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!reserva) {
      await t.rollback();
      return res.status(404).json({ message: 'Reserva no encontrada o no pertenece a tu usuario.' });
    }

    // Validar estado actual
    if (reserva.estado_reserva !== 'pendiente' && reserva.estado_reserva !== 'confirmada') {
      await t.rollback();
      return res.status(400).json({ message: 'Solo se pueden cancelar reservas que estén pendientes o confirmadas.' });
    }

    // Actualizar estado
    await reserva.update({ estado_reserva: 'cancelada' }, { transaction: t });

    // Crear notificación de cancelación
    await Notificacion.create({
      id_usuario,
      mensaje: `Tu reserva ${reserva.codigo_reserva} fue cancelada`,
      leido: false
    }, { transaction: t });

    await t.commit();

    res.status(200).json({ message: 'La reserva ha sido cancelada exitosamente.' });

  } catch (error) {
    await t.rollback();
    console.error('Error en cancelarReserva:', error);
    res.status(500).json({ message: 'Error en el servidor al intentar cancelar la reserva.' });
  }
};

/**
 * Función 5: getAllReservas (Solo Administrador)
 * Permite listar todas las reservas de la base de datos con filtros opcionales.
 */
const getAllReservas = async (req, res) => {
  try {
    // Regla: Solo admins
    if (!req.usuario || req.usuario.id_rol !== ADMIN_ROLE_ID) {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden ver todas las reservas.' });
    }

    const { estado, id_vuelo } = req.query;

    const whereClause = {};
    if (estado) whereClause.estado_reserva = estado;
    if (id_vuelo) whereClause.id_vuelo = id_vuelo;

    const reservas = await Reserva.findAll({
      where: whereClause,
      include: [
        { model: Usuario, attributes: ['id_usuario', 'email'] },
        { model: Vuelo },
        { model: Sucursal }
      ]
    });

    res.status(200).json(reservas);

  } catch (error) {
    console.error('Error en getAllReservas:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener el listado de reservas.' });
  }
};

module.exports = {
  getMisReservas,
  getReservaById,
  createReserva,
  cancelarReserva,
  getAllReservas
};
