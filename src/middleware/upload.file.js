// gestion y validacion de los ficheros
const multer = require("multer")                                                                // Middleware para manejar la carga de archivos
const cloudinary = require("cloudinary").v2                                                         
const { CloudinaryStorage } = require("multer-storage-cloudinary")  

// permite subir a cloudinary las imagenes previamente validadas con el multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,                                                                      // Configuración de Cloudinary
    params: {
        folder: "cucumber federation",                                                           // Carpeta en la que se almacenarán los archivos en Cloudinary
        allowedFormats: ["jpg", "png", "svg", "gif", "jpeg"]                                     // Formatos permitidos para los archivos
    }
    
})

// subo la imagen que cumpla con los  parametros definidos
const upload = multer({ storage });
module.exports = upload;
