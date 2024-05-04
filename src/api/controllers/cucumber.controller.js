// cucumber.controller.js

const Cucumber = require('../models/cucumber.model');

// Función para crear un nuevo pepino
const createCucumber = async (req, res) => {
  try {
    const { variety, color, weight } = req.body; // Extraemos la variedad, color y peso del cuerpo de la solicitud
    const { farmerId } = req.user; // Obtenemos el ID del agricultor desde el token de autenticación

    // Creamos un nuevo documento de pepino con la información proporcionada
    const cucumberDoc = new Cucumber({
      variety,
      color,
      weight,
      farmer: farmerId // Asignamos el ID del agricultor al pepino
    });

    // Guardamos el pepino en la base de datos
    const createdCucumber = await cucumberDoc.save();

    // Respondemos con el pepino creado
    return res.status(201).json({ success: true, data: createdCucumber });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// Función para obtener la lista de pepinos cultivados por un agricultor específico
const getCucumbers = async (req, res) => {
  try {
    const { farmerId } = req.user; // Obtenemos el ID del agricultor desde el token de autenticación

    // Buscamos todos los pepinos cultivados por el agricultor específico
    const cucumbers = await Cucumber.find({ farmer: farmerId });

    // Respondemos con la lista de pepinos
    return res.status(200).json({ success: true, data: cucumbers });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { createCucumber, getCucumbers };

