const { 
  sequelize, Reserva, Vuelo, Avion, Aeropuerto, 
  Pago, Equipaje, Notificacion, Sucursal, Usuario 
} = require('../models');
const ADMIN_ROLE_ID = 1;
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
const createReserva = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (req.usuario.id_rol === ADMIN_ROLE_ID) {
      await t.rollback();
      return res.status(403).json({ message: 'Los administradores no pueden crear reservas.' });
    }
    const id_usuario = req.usuario.id_usuario;
    const { id_vuelo, id_sucursal } = req.body;
    const vuelo = await Vuelo.findByPk(id_vuelo, {
      include: [{ model: Avion }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    if (!vuelo) {
      await t.rollback();
      return res.status(404).json({ message: 'El vuelo especificado no existe.' });
    }
    if (vuelo.estado !== 'programado') {
      await t.rollback();
      return res.status(400).json({ message: 'Este vuelo no está disponible para reserva.' });
    }
    const reservasActivas = await Reserva.count({
      where: {
        id_vuelo,
        estado_reserva: ['pendiente', 'confirmada']
      },
      transaction: t
    });
    const capacidadAvion = vuelo.Avion.capacidad;
    if (reservasActivas >= capacidadAvion) {
      await t.rollback();
      return res.status(400).json({ message: 'Lo sentimos, no hay capacidad disponible en este vuelo.' });
    }
    const nuevaReserva = await Reserva.create({
      id_usuario,
      id_vuelo,
      id_sucursal: id_sucursal || null,
      fecha: new Date(),
      estado_reserva: 'pendiente'
    }, { transaction: t });
    await Notificacion.create({
      id_usuario,
      mensaje: `Tu reserva ${nuevaReserva.codigo_reserva} fue creada exitosamente`,
      leido: false
    }, { transaction: t });
    await t.commit();
    res.status(201).json({
      message: 'Reserva creada exitosamente.',
      reserva: nuevaReserva
    });
  } catch (error) {
    await t.rollback();
    console.error('Error en createReserva:', error);
    res.status(500).json({ message: 'Error en el servidor al intentar crear la reserva.' });
  }
};
const cancelarReserva = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id_usuario = req.usuario.id_usuario;
    const { id_reserva } = req.params;
    const reserva = await Reserva.findOne({
      where: { id_reserva, id_usuario },
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    if (!reserva) {
      await t.rollback();
      return res.status(404).json({ message: 'Reserva no encontrada o no pertenece a tu usuario.' });
    }
    if (reserva.estado_reserva !== 'pendiente' && reserva.estado_reserva !== 'confirmada') {
      await t.rollback();
      return res.status(400).json({ message: 'Solo se pueden cancelar reservas que estén pendientes o confirmadas.' });
    }
    await reserva.update({ estado_reserva: 'cancelada' }, { transaction: t });
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
const getAllReservas = async (req, res) => {
  try {
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
