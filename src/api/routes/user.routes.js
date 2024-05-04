const express = require('express');
const router = express.Router();
const {
  register,
  login,
  modifyProfile,
  getUsers,
  deleteUser
} = require('../controllers/user.controller');
const { isAuth } = require('../../middleware/auth');
const upload = require('../../middleware/upload.file'); //con la funcion upload gestiono la subida y validacion del archivo, donde "image"  hace referencia al modelo datos de datos  [upload.single("image")]

router.post('/register', register); 
router.post('/login', login); 
router.put('/updateUser/:id', [isAuth], modifyProfile); // Modificación de perfil de agricultor (requiere autenticación)
router.get('/selectUser/:name', getUsers) 
router.delete('/deleteUser/:id', deleteUser); 

module.exports = router;