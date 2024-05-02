

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema para representar a un agricultor
const farmerSchema = new Schema({
  name: { type: String, required: true }, // Nombre del agricultor (requerido)
  email: { type: String, required: true }, // Correo electrónico del agricultor (requerido)
  password: { type: String, required: true }, // Contraseña del agricultor (requerida)
  role: {
    type: String,
    default: 'farmer', // Rol predeterminado: 'farmer' (agricultor)
    enum: ['admin', 'farmer'], // Solo se permiten los roles 'admin' o 'farmer'
  },
  image: { type: String, default: "" } // Ruta de la imagen del agricultor (opcional, por defecto vacía)
});

// Creación del modelo de Mongoose para los agricultores
const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer;
