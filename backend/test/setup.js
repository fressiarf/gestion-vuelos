require('dotenv').config();
const jwt = require('jsonwebtoken');
const { sequelize, Rol, Usuario } = require('../models');

// Tokens exportables para que los tests los utilicen
const tokens = {
  admin: null,
  cliente: null
};

beforeAll(async () => {
  // Limpiar y crear tablas desde cero en memoria o en la DB de tests
  await sequelize.sync({ force: true });

  // Crear roles mínimos requeridos
  await Rol.bulkCreate([
    { nombre_rol: 'admin', permisos: 'all' },
    { nombre_rol: 'cliente', permisos: 'read,reserve' }
  ]);

  // Crear usuario administrador
  const admin = await Usuario.create({
    id_rol: 1,
    email: 'admin_test@vuelos.com',
    password: 'hashedpassword123',
    fecha_registro: new Date()
  });

  // Crear usuario cliente
  const cliente = await Usuario.create({
    id_rol: 2,
    email: 'cliente_test@vuelos.com',
    password: 'hashedpassword123',
    fecha_registro: new Date()
  });

  // Firmar JWTs y almacenarlos en el objeto exportable
  tokens.admin = jwt.sign(
    { id_usuario: admin.id_usuario, email: admin.email, id_rol: admin.id_rol },
    process.env.JWT_SECRET || 'secret_test',
    { expiresIn: '1h' }
  );

  tokens.cliente = jwt.sign(
    { id_usuario: cliente.id_usuario, email: cliente.email, id_rol: cliente.id_rol },
    process.env.JWT_SECRET || 'secret_test',
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  // Cerrar la conexión para que Jest termine correctamente
  await sequelize.close();
});

module.exports = {
  tokens
};
