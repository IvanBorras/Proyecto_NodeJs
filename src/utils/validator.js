const User = require('../api/models/user.model'); // Importa el modelo de User (usuario)

// Función para validar si un correo electrónico ya existe en la base de datos
const validateEmailDB = async (emailUser) => {
  try {
    const validateEmail = await User.findOne({ email: emailUser });                   // Busca en la base de datos un User con el correo electrónico proporcionado
    return validateEmail;                                                             // Devuelve el resultado de la consulta (puede ser null si no se encuentra ningún User con ese correo electrónico)
  } catch (error) {
    console.log(error);                                                                    // Maneja cualquier error que ocurra durante la consulta a la base de datos
  }
};

// Función para validar la fortaleza de una contraseña utilizando expresiones regulares
const validatePassword = (pass) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;                                     // Expresión regular que define los criterios de una contraseña segura
  return regex.test(pass);                                                                               // Devuelve true si la contraseña cumple con los criterios definidos por la expresión regular, de lo contrario, devuelve false
};

module.exports = { validateEmailDB, validatePassword }; // Exporta las funciones para que puedan ser utilizadas en otras partes de la aplicación
