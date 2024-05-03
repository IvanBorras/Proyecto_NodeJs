const jwt = require("jsonwebtoken"); // Importa el módulo jsonwebtoken para trabajar con tokens JWT

// Función para generar un token JWT
const generateToken = (data) => {     // 'data' es la información que se guardará en el token
    return jwt.sign(data, process.env.SECRET_JWT, { expiresIn: '1h' });  // 'process.env.SECRET_JWT' es la clave secreta utilizada para firmar el token, recuperada de las variables de entorno. { expiresIn: '1h' } define el tiempo de expiración del token.
}

// Función para verificar y decodificar un token JWT
const verifyToken = (token) => {
    console.log(token); // Muestra el token en la consola (para fines de depuración)
    return jwt.verify(token, "secreteKeyPepino"); // Verifica y decodifica el token utilizando la clave secreta "secreteKeyPepino"
}

// Exporta las funciones 'generateToken' y 'verifyToken' para que puedan ser utilizadas en otras partes de la aplicación
module.exports = { generateToken, verifyToken };
