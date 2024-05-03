const nodemailer = require('nodemailer'); // Importa el módulo nodemailer para enviar correos electrónicos

// Configuración del objeto de transporte para enviar correos electrónicos
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email', // Servidor SMTP para enviar correos electrónicos (en este caso, Ethereal)
    port: 587, // Puerto del servidor SMTP
    secure: false, // Si el servidor SMTP utiliza SSL o TLS
    auth: {
        user: 'amaya.hamill47@ethereal.email', // Nombre de usuario para autenticarse en el servidor SMTP
        pass: 'nMFrSseGeEHC8FRBFt' // Contraseña para autenticarse en el servidor SMTP
    }
});

module.exports = transporter; // Exporta el objeto de transporte para que pueda ser utilizado en otras partes de la aplicación
