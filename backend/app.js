const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const vueloRoutes = require('./routes/vuelo.routes');
const reservaRoutes = require('./routes/reserva.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const notificacionRoutes = require('./routes/notificacion.routes');
const pagoRoutes = require('./routes/pago.routes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/vuelos', vueloRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/pagos', pagoRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Error Global:', err);
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => e.message);
    return res.status(400).json({ message: 'Error de validación', errors });
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'El registro ya existe (conflicto de unicidad)' });
  }
  res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = app;