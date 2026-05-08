const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const { verifyToken, isCliente } = require('../middlewares/authMiddleware');
router.post('/', verifyToken, isCliente, pagoController.createPago);
router.get('/reserva/:id', verifyToken, pagoController.getPagosByReserva);
module.exports = router;
