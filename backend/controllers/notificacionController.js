const { Notificacion } = require('../models');
const getMisNotificaciones = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario;
    const notificaciones = await Notificacion.findAll({
      where: { id_usuario },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(notificaciones);
  } catch (error) {
    console.error('Error en getMisNotificaciones:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener las notificaciones.' });
  }
};
const marcarLeida = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario;
    const { id_notificacion } = req.params;
    const notificacion = await Notificacion.findOne({
      where: { id_notificacion, id_usuario }
    });
    if (!notificacion) {
      return res.status(404).json({ message: 'Notificación no encontrada o no pertenece a tu cuenta.' });
    }
    await notificacion.update({ leido: true });
    res.status(200).json({ 
      message: 'Notificación marcada como leída.',
      notificacion 
    });
  } catch (error) {
    console.error('Error en marcarLeida:', error);
    res.status(500).json({ message: 'Error en el servidor al marcar la notificación.' });
  }
};
const marcarTodasLeidas = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario;
    await Notificacion.update(
      { leido: true },
      { 
        where: { 
          id_usuario, 
          leido: false 
        } 
      }
    );
    res.status(200).json({ message: 'Todas las notificaciones han sido marcadas como leídas.' });
  } catch (error) {
    console.error('Error en marcarTodasLeidas:', error);
    res.status(500).json({ message: 'Error en el servidor al actualizar las notificaciones.' });
  }
};
module.exports = {
  getMisNotificaciones,
  marcarLeida,
  marcarTodasLeidas
};
