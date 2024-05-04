const express = require('express');
const router = express.Router();
const {
  register,
  login,
  modifyProfile,
  getUsers,
} = require('../controllers/user.controller');
const { isAuth } = require('../../middleware/auth');

const upload = require('../../middleware/upload.file');

//con la funcion upload gestiono la subida y validacion del archivo, donde "image"  hace referencia al modelo datos de datos  [upload.single("image")]
router.post('/register', register); // Registro de agricultor
router.post('/login', login); // Autenticación de agricultor
router.put('/update', [isAuth], modifyProfile); // Modificación de perfil de agricultor (requiere autenticación)
router.get('/alluser', [isAuth], getUsers); //Obtener lista de todos los agricultores (requiere autenticación)

module.exports = router;