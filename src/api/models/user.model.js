

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema para representar a un agricultor
const farmerSchema = new Schema({
  id:{ type: Number},
  name: { type: String, required: true }, 
  email: { type: String, required: true }, 
  password: { type: String, required: true }, 
  image: { type: String, default: "" }, // Ruta de la imagen del agricultor (opcional, por defecto vacía)
  cucumbers: [{ type: Schema.ObjectId, ref:'pepinos'}], //ref:'pepinos' hace referencia al modelo de pepinos
  role: {
    type: String,
    default: 'farmer', // Rol predeterminado: 'farmer' (agricultor)
    enum: ['admin', 'farmer'], // Solo se permiten los roles 'admin' o 'farmer'
  }
},
  {
    collection: 'agricultores'
  }

);

// Creación del modelo de Mongoose para los agricultores
const Farmer = mongoose.model('agricultores', farmerSchema);

module.exports = Farmer;
