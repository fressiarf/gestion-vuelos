const { Usuario, Rol, Reserva } = require('../models');
const ADMIN_ROLE_ID = 1;
const getAllUsuarios = async (req, res) => {
  try {
    if (!req.usuario || req.usuario.id_rol !== ADMIN_ROLE_ID) {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden listar usuarios.' });
    }
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: Rol }]
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error en getAllUsuarios:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener los usuarios.' });
  }
};
const getUsuarioById = async (req, res) => {
  try {
    if (!req.usuario || req.usuario.id_rol !== ADMIN_ROLE_ID) {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
    }
    const { id_usuario } = req.params;
    const usuario = await Usuario.findByPk(id_usuario, {
      attributes: { exclude: ['password'] },
      include: [{ model: Rol }]
    });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error en getUsuarioById:', error);
    res.status(500).json({ message: 'Error en el servidor al buscar el usuario.' });
  }
};
const updateUsuario = async (req, res) => {
  try {
    if (!req.usuario || req.usuario.id_rol !== ADMIN_ROLE_ID) {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden editar roles u otros usuarios.' });
    }
    const { id_usuario } = req.params;
    const { email, id_rol } = req.body;
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    if (email && email !== usuario.email) {
      const emailEnUso = await Usuario.findOne({ where: { email } });
      if (emailEnUso) {
        return res.status(400).json({ message: 'El correo electrónico especificado ya está en uso por otro usuario.' });
      }
    }
    await usuario.update({ email, id_rol });
    const usuarioActualizado = await Usuario.findByPk(id_usuario, {
      attributes: { exclude: ['password'] },
      include: [{ model: Rol }]
    });
    res.status(200).json({ message: 'Usuario actualizado exitosamente.', usuario: usuarioActualizado });
  } catch (error) {
    console.error('Error en updateUsuario:', error);
    res.status(500).json({ message: 'Error en el servidor al actualizar el usuario.' });
  }
};
const deleteUsuario = async (req, res) => {
  try {
    if (!req.usuario || req.usuario.id_rol !== ADMIN_ROLE_ID) {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
    }
    const { id_usuario } = req.params;
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    const reservasActivas = await Reserva.count({
      where: {
        id_usuario,
        estado_reserva: ['pendiente', 'confirmada']
      }
    });
    if (reservasActivas > 0) {
      return res.status(400).json({ 
        message: `No se puede eliminar el usuario porque tiene ${reservasActivas} reserva(s) activa(s).` 
      });
    }
    await usuario.destroy();
    res.status(200).json({ message: 'Usuario eliminado del sistema exitosamente.' });
  } catch (error) {
    console.error('Error en deleteUsuario:', error);
    res.status(500).json({ message: 'Error en el servidor al eliminar el usuario.' });
  }
};
module.exports = {
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario
};
