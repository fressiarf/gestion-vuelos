const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');
const { verifyToken } = require('../middlewares/authMiddleware');
router.get('/', verifyToken, notificacionController.getMisNotificaciones);
router.put('/leer-todas', verifyToken, notificacionController.marcarTodasLeidas);
router.put('/:id/leer', verifyToken, notificacionController.marcarLeida);
module.exports = router;
