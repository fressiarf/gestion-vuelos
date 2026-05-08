const { Pago, Reserva, Notificacion, sequelize } = require('../models');
const createPago = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id_usuario = req.usuario.id_usuario;
    const { id_reserva, monto, metodo_pago } = req.body;
    const reserva = await Reserva.findOne({
      where: { id_reserva, id_usuario },
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    if (!reserva) {
      await t.rollback();
      return res.status(404).json({ message: 'Reserva no encontrada o no pertenece a tu cuenta.' });
    }
    const pagosExitosos = await Pago.count({
      where: { id_reserva, estado_pago: 'completado' },
      transaction: t
    });
    if (pagosExitosos > 0) {
      await t.rollback();
      return res.status(400).json({ message: 'Esta reserva ya ha sido pagada en su totalidad.' });
    }
    const nuevoPago = await Pago.create({
      id_reserva,
      monto,
      metodo_pago,
      estado_pago: 'pendiente',
      fecha_transaccion: new Date()
    }, { transaction: t });
    await nuevoPago.update({ estado_pago: 'completado' }, { transaction: t });
    await reserva.update({ estado_reserva: 'confirmada' }, { transaction: t });
    await Notificacion.create({
      id_usuario,
      mensaje: `¡Pago exitoso! Tu reserva ${reserva.codigo_reserva} ha sido confirmada mediante ${metodo_pago}.`,
      leido: false
    }, { transaction: t });
    await t.commit();
    res.status(201).json({
      message: 'Pago procesado y reserva confirmada exitosamente.',
      pago: nuevoPago
    });
  } catch (error) {
    await t.rollback();
    console.error('Error en createPago:', error);
    res.status(500).json({ message: 'Error en el servidor al intentar procesar el pago.' });
  }
};
const getPagosByReserva = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario;
    const { id_reserva } = req.params;
    const reserva = await Reserva.findOne({
      where: { id_reserva, id_usuario }
    });
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada o acceso denegado.' });
    }
    const pagos = await Pago.findAll({
      where: { id_reserva },
      order: [['fecha_transaccion', 'DESC']]
    });
    res.status(200).json(pagos);
  } catch (error) {
    console.error('Error en getPagosByReserva:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener los pagos de la reserva.' });
  }
};
module.exports = {
  createPago,
  getPagosByReserva
};
