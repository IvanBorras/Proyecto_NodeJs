const express = require('express');
const router = express.Router();
const {createCucumber, getCucumber, updateCucumber, deleteCucumber} = require('../controllers/cucumber.controller');
const { isAuth } = require('../../middleware/auth');


router.post('/create', [isAuth], createCucumber);
router.get('/list', [isAuth], getCucumber);
router.put('/update/:id', [isAuth], updateCucumber);
router.delete('/delete/:id', [isAuth], deleteCucumber);

module.exports = router;
