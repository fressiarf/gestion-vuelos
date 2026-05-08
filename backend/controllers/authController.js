const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');

/**
 * Función 1: register
 * Registra un nuevo usuario validando email único y encriptando contraseña
 */
const register = async (req, res) => {
  try {
    const { email, password, id_rol } = req.body;

    // Validar que email no exista ya en BD
    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Hashear password con bcrypt (saltRounds: 10)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario con fecha_registro = new Date()
    const nuevoUsuario = await Usuario.create({
      email,
      password: hashedPassword,
      id_rol,
      fecha_registro: new Date()
    });

    // Responder 201
    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      usuario: {
        id: nuevoUsuario.id_usuario,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.id_rol
      }
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error en el servidor al registrar el usuario.' });
  }
};

/**
 * Función 2: login
 * Autentica al usuario, verifica contraseña y genera token JWT
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email incluyendo su Role (ahora Rol)
    const usuario = await Usuario.findOne({
      where: { email },
      include: [{ model: Rol }]
    });

    // Si no existe el usuario
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Comparar password con bcrypt.compare
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Generar JWT con payload { id_usuario, email, id_rol }
    const payload = {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      id_rol: usuario.id_rol
    };

    // Token expira en '24h'
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Responder 200
    res.status(200).json({
      token,
      usuario: {
        id: usuario.id_usuario,
        email: usuario.email,
        rol: usuario.id_rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión.' });
  }
};

/**
 * Función 3: getProfile
 * Retorna los datos del usuario autenticado
 */
const getProfile = async (req, res) => {
  try {
    // Middleware de auth ya habrá puesto req.usuario
    const userId = req.usuario.id_usuario;

    // Buscar usuario por id incluyendo Role (Rol)
    const usuario = await Usuario.findByPk(userId, {
      attributes: { exclude: ['password'] }, // No enviar la contraseña en la respuesta
      include: [{ model: Rol }]
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Responder 200 con datos del perfil
    res.status(200).json(usuario);

  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener el perfil.' });
  }
};

// Exportar
module.exports = {
  register,
  login,
  getProfile
};
