const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');
const register = async (req, res) => {
  try {
    const { email, password, id_rol } = req.body;
    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const nuevoUsuario = await Usuario.create({
      email,
      password: hashedPassword,
      id_rol,
      fecha_registro: new Date()
    });
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
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({
      where: { email },
      include: [{ model: Rol }]
    });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const payload = {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      id_rol: usuario.id_rol
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
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
const getProfile = async (req, res) => {
  try {
    const userId = req.usuario.id_usuario;
    const usuario = await Usuario.findByPk(userId, {
      attributes: { exclude: ['password'] }, 
      include: [{ model: Rol }]
    });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener el perfil.' });
  }
};
module.exports = {
  register,
  login,
  getProfile
};
