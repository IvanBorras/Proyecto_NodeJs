// cucumber.routes.js
const express = require('express');
const router = express.Router();
const cucumberController = require('../controllers/cucumber.controllers');

router.post('/create', cucumberController.createCucumber);
router.get('/list', cucumberController.getCucumbers);

// Agrega más rutas según sea necesario

module.exports = router;
