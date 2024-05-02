const nodemailer = require('nodemailer');


// Configuración del objeto de transporte
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'amaya.hamill47@ethereal.email',
        pass: 'nMFrSseGeEHC8FRBFt'
    }
});

module.exports = transporter;