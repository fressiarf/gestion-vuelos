const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Token requerido. Por favor inicie sesión.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Formato de token inválido. Use: Bearer <token>' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.' });
    }
    return res.status(401).json({ message: 'Token inválido o modificado.' });
  }
};
const isAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ message: 'Token no verificado. Faltan datos del usuario.' });
  }
  if (req.usuario.id_rol !== 1) {
    return res.status(403).json({ message: 'Acceso denegado: se requiere rol administrador.' });
  }
  next();
};
const isCliente = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ message: 'Token no verificado. Faltan datos del usuario.' });
  }
  if (req.usuario.id_rol === 1) {
    return res.status(403).json({ message: 'Esta acción es solo para clientes.' });
  }
  next();
};
module.exports = {
  verifyToken,
  isAdmin,
  isCliente
};
