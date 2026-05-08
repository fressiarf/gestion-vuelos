const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
router.get('/', verifyToken, isAdmin, usuarioController.getAllUsuarios);
router.get('/:id', verifyToken, isAdmin, usuarioController.getUsuarioById);
router.put('/:id', verifyToken, isAdmin, usuarioController.updateUsuario);
router.delete('/:id', verifyToken, isAdmin, usuarioController.deleteUsuario);
module.exports = router;
