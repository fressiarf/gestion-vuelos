const { Vuelo, Avion, Aeropuerto, Tripulacion, Reserva } = require('../models');

// Asumimos que el ID del Rol Administrador es 1. 
// Esto podría ajustarse o consultarse directamente en base de datos si fuera necesario.
const ADMIN_ROLE_ID = 1;

/**
 * Función 1: getAllVuelos
 * Lista todos los vuelos en estado 'programado'
 * Permite filtrar opcionalmente por origen y destino
 */
const getAllVuelos = async (req, res) => {
  try {
    const { origen, destino } = req.query;
    
    // Condición base: solo vuelos programados
    const whereClause = { estado: 'programado' };
    
    // Filtros por query params
    if (origen) whereClause.id_aeropuerto_origen = origen;
    if (destino) whereClause.id_aeropuerto_destino = destino;

    const vuelos = await Vuelo.findAll({
      where: whereClause,
      include: [
        { model: Avion },
        { model: Aeropuerto, as: 'aeropuerto_origen' },
        { model: Aeropuerto, as: 'aeropuerto_destino' }
      ]
    });

    res.status(200).json(vuelos);
  } catch (error) {
    console.error('Error en getAllVuelos:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener los vuelos' });
  }
};

/**
 * Función 2: getVueloById
 * Obtiene el detalle completo de un vuelo específico
 */
const getVueloById = async (req, res) => {
  try {
    const { id_vuelo } = req.params;

    const vuelo = await Vuelo.findByPk(id_vuelo, {
      include: [
        { model: Avion },
        { model: Aeropuerto, as: 'aeropuerto_origen' },
        { model: Aeropuerto, as: 'aeropuerto_destino' },
        { model: Tripulacion }
      ]
    });

    if (!vuelo) {
      return res.status(404).json({ message: 'El vuelo solicitado no existe.' });
    }

    res.status(200).json(vuelo);
  } catch (error) {
    console.error('Error en getVueloById:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener el vuelo' });
  }
};

/**
 * Función 3: createVuelo (Solo Admin)
 * Crea un nuevo vuelo verificando la existencia de sus referencias
 */
const createVuelo = async (req, res) => {
  try {
    // Validar que sea administrador
    if (!req.usuario || req.usuario.id_rol !== ADMIN_ROLE_ID) {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden crear vuelos.' });
    }

    const { id_avion, id_aeropuerto_origen, id_aeropuerto_destino, numero_vuelo, precio_base } = req.body;

    // Validar que origen y destino no sean iguales
    if (id_aeropuerto_origen === id_aeropuerto_destino) {
      return res.status(400).json({ message: 'El aeropuerto de origen y destino no pueden ser el mismo.' });
    }

    // Validar que el avión exista
    const avion = await Avion.findByPk(id_avion);
    if (!avion) {
      return res.status(404).json({ message: 'El avión especificado no existe.' });
    }

    // Validar aeropuertos
    const origen = await Aeropuerto.findByPk(id_aeropuerto_origen);
    if (!origen) return res.status(404).json({ message: 'El aeropuerto de origen no existe.' });

    const destino = await Aeropuerto.findByPk(id_aeropuerto_destino);
    if (!destino) return res.status(404).json({ message: 'El aeropuerto de destino no existe.' });

    // Crear el vuelo en estado programado
    const nuevoVuelo = await Vuelo.create({
      id_avion,
      id_aeropuerto_origen,
      id_aeropuerto_destino,
      numero_vuelo,
      precio_base,
      estado: 'programado'
    });

    res.status(201).json({
      message: 'Vuelo creado exitosamente',
      vuelo: nuevoVuelo
    });

  } catch (error) {
    console.error('Error en createVuelo:', error);
    res.status(500).json({ message: 'Error en el servidor al crear el vuelo' });
  }
};

/**
 * Función 4: updateVuelo (Solo Admin)
 * Actualiza los datos de un vuelo con validaciones de estado
 */
const updateVuelo = async (req, res) => {
  try {
    // Validar que sea administrador
    if (!req.usuario || req.usuario.id_rol !== ADMIN_ROLE_ID) {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden modificar vuelos.' });
    }

    const { id_vuelo } = req.params;
    const datosActualizar = req.body;

    const vuelo = await Vuelo.findByPk(id_vuelo);
    if (!vuelo) {
      return res.status(404).json({ message: 'El vuelo que intentas actualizar no existe.' });
    }

    // Regla de negocio: No pasar de 'cancelado' a 'en_vuelo'
    if (vuelo.estado === 'cancelado' && datosActualizar.estado === 'en_vuelo') {
      return res.status(400).json({ message: 'Un vuelo cancelado no puede pasar a estado en_vuelo directamente.' });
    }

    await vuelo.update(datosActualizar);

    res.status(200).json({
      message: 'Vuelo actualizado exitosamente',
      vuelo
    });

  } catch (error) {
    console.error('Error en updateVuelo:', error);
    res.status(500).json({ message: 'Error en el servidor al actualizar el vuelo' });
  }
};

/**
 * Función 5: deleteVuelo (Solo Admin)
 * Realiza un borrado lógico (cancelación) si no hay reservas activas
 */
const deleteVuelo = async (req, res) => {
  try {
    // Validar que sea administrador
    if (!req.usuario || req.usuario.id_rol !== ADMIN_ROLE_ID) {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden cancelar vuelos.' });
    }

    const { id_vuelo } = req.params;

    const vuelo = await Vuelo.findByPk(id_vuelo);
    if (!vuelo) {
      return res.status(404).json({ message: 'El vuelo no existe.' });
    }

    // Solo se pueden cancelar vuelos programados
    if (vuelo.estado !== 'programado') {
      return res.status(400).json({ message: 'Solo se pueden cancelar vuelos que estén en estado programado.' });
    }

    // Verificar que no haya reservas pendientes o confirmadas
    const cantidadReservas = await Reserva.count({
      where: {
        id_vuelo,
        estado_reserva: ['pendiente', 'confirmada']
      }
    });

    if (cantidadReservas > 0) {
      return res.status(400).json({ 
        message: `No se puede cancelar el vuelo porque tiene ${cantidadReservas} reserva(s) activa(s).` 
      });
    }

    // Soft delete: Cambiar el estado a cancelado
    await vuelo.update({ estado: 'cancelado' });

    res.status(200).json({ message: 'Vuelo cancelado exitosamente.' });

  } catch (error) {
    console.error('Error en deleteVuelo:', error);
    res.status(500).json({ message: 'Error en el servidor al cancelar el vuelo' });
  }
};

module.exports = {
  getAllVuelos,
  getVueloById,
  createVuelo,
  updateVuelo,
  deleteVuelo
};
