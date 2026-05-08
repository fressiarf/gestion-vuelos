const { Usuario, Rol, Reserva } = require('../models');

// Asumimos que el ID del Rol Administrador es 1
const ADMIN_ROLE_ID = 1;

/**
 * Listar todos los usuarios.
 * Solo administradores. Excluye el campo password e incluye el Rol.
 */
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

/**
 * Buscar un usuario específico por su ID.
 * Solo administradores. Excluye password e incluye Rol.
 */
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

/**
 * Actualizar email o id_rol de un usuario.
 * Requiere rol de administrador (implícito para gestión de roles y cuentas).
 * Valida que el email nuevo no esté en uso.
 */
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

    // Validar email duplicado
    if (email && email !== usuario.email) {
      const emailEnUso = await Usuario.findOne({ where: { email } });
      if (emailEnUso) {
        return res.status(400).json({ message: 'El correo electrónico especificado ya está en uso por otro usuario.' });
      }
    }

    // Actualizar campos
    await usuario.update({ email, id_rol });

    // Retornar datos actualizados sin password
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

/**
 * Eliminar (borrar) un usuario del sistema.
 * Solo administradores.
 * Valida que el usuario no tenga reservas activas (pendientes o confirmadas).
 */
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

    // Verificar si el usuario tiene reservas activas
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
