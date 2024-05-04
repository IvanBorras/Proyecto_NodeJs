const User = require("../api/models/user.model")                
const { verifyToken } = require("../utils/jwt") ;                                                             // Importa la función verifyToken del archivo jwt.js en la carpeta utils.

const isAuth = async (req, res, next) => {                    
    try {
        const auth = req.headers.authorization;                                                              // Extrae el token de autenticación de las cabeceras de la solicitud.

        if (!auth) {                                                                                         // Verifica si no se proporciona un token de autenticación en las cabeceras de la solicitud y devuelve un error si no hay un token.
            return res.status(400).json({ message: "No hay token" })
        }

        const token = auth.split(" ")[1];                                                                   // Extrae el token JWT de la cadena Authorization dividiendo la cadena por espacios y tomando el segundo elemento.

        const tokenVerified = verifyToken(token)                                                            // Verifica y decodifica el token 
        
        console.log(tokenVerified)                                                           

        if (!tokenVerified._id) {                                                                           // Verifica si no se encuentra un ID de usuario en el token decodificado y devuelve un error si el token es incorrecto.
            return res.status(400).json({ message: "Token  incorrecto" })
        }

        const userProfile = await User.findById(tokenVerified._id)                                          // Busca al usuario en la base de datos utilizando el ID de usuario obtenido del token decodificado.

        req.userProfile = userProfile;                                                                      // Almacena la información del usuario en el objeto de solicitud req para su posterior uso en otras partes de la aplicación.

        next()                                                                                              // Llama a la siguiente función de middleware en la cadena.
    } catch (error) {   
        console.log(error)                                                                                  // Maneja cualquier error que ocurra durante el proceso de autenticación y lo registra en la consola.
    }
}

module.exports = { isAuth }                                                                                 // Exporta la función de middleware isAuth para que pueda ser utilizada en otras partes de la aplicación.
