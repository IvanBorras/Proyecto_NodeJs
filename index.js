//importar dependencias y archivos
const express = require('express'); // Importa Express, un framework web para Node.js
const { connectDB } = require('./src/utils/database'); // Importa la función connectDB desde un archivo llamado database.js en el directorio src/utils
const routerUser = require('./src/api/routes/user.routes'); // Importa el enrutador de usuario desde un archivo llamado user.routes.js en el directorio src/api/routes
const env = require('dotenv'); // Importa el paquete dotenv para cargar variables de entorno desde un archivo .env
const cloudinary = require('cloudinary').v2; // Importa la biblioteca Cloudinary para trabajar con servicios de almacenamiento de imágenes en la nube
const cors = require('cors'); // Importa el middleware CORS para permitir solicitudes de diferentes dominios

env.config(); // Carga las variables de entorno del archivo .env en process.env


// CONFIGURACIÓN DEL SERVIDOR

// Configuración de Cloudinary con las credenciales proporcionadas en el archivo .env
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUD,
  api_secret: process.env.API_SECRET_CLOUD,
});

const server = express(); // Crea una instancia de Express llamada "server"
server.use(express.json()); // Middleware para analizar el cuerpo de las solicitudes como JSON
connectDB(); // Llama a la función connectDB para conectar la base de datos
server.use(cors()); // Middleware para permitir solicitudes de diferentes dominios
server.use('/user', routerUser); // Usa el enrutador de usuario para manejar las solicitudes dirigidas a '/user'

//EJECUCIÓN DEL SERVIDOR
const PORT = process.env.PORT; // Obtiene el número de puerto del archivo .env
server.listen(PORT, () => { // Hace que el servidor escuche en el puerto especificado
  console.log(`Escuchando puerto http://localhost:${PORT}`); // Muestra un mensaje en la consola indicando que el servidor está escuchando en un puerto específico
});




