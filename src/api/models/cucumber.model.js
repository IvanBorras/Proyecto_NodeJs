// cucumber.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema para representar a un pepino
const cucumberSchema = new Schema({
  id:{ type: Number},
  variety: { type: String, required: true }, // Variedad del pepino (requerida)
  color: { type: String, required: true }, // Color del pepino (requerido)
  weight: { type: Number, required: true }, // Peso del pepino en gramos (requerido)
  farmer: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true } // ID del agricultor que cultiva el pepino (requerido)
},
  {
    collection: 'pepinos'
  }

);

// Creación del modelo de Mongoose para los pepinos
const Cucumber = mongoose.model('pepinos', cucumberSchema);

module.exports = Cucumber;
