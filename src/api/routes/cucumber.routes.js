const express = require('express');
const router = express.Router();
const cucumberController = require('../controllers/cucumber.controllers');
const { isAuth } = require('../../middleware/auth');

// Ruta para crear un nuevo pepino (requiere autenticación)
router.post('/create', [isAuth], cucumberController.createCucumber);

// Ruta para obtener la lista de pepinos de un agricultor específico (requiere autenticación)
router.get('/list', [isAuth], cucumberController.getCucumbers);

// Ruta para actualizar un pepino existente (requiere autenticación)
router.put('/update/:id', [isAuth], cucumberController.updateCucumber);

// Ruta para eliminar un pepino (requiere autenticación)
router.delete('/delete/:id', [isAuth], cucumberController.deleteCucumber);

module.exports = router;
