const Farmer = require('../models/user.model'); // Importa el modelo Farmer del archivo user.model.js ubicado en el directorio ../models/
const bcrypt = require('bcrypt'); // Importa la biblioteca bcrypt para el hash y la comparación de contraseñas
const { validateEmailDB, validatePassword } = require('../../utils/validator'); // Importa las funciones validateEmailDB y validatePassword del archivo validator.js ubicado en el directorio ../../utils/
const { generateToken } = require('../../utils/jwt'); // Importa la función generateToken del archivo jwt.js ubicado en el directorio ../../utils/
const generateRandomNumber = require('../../utils/generateRandomNumber'); // Importa la función generateRandomNumber del archivo generateRandomNumber.js ubicado en el directorio ../../utils/
const transporter = require('../../utils/nodemailer-config'); // Importa el objeto transporter del archivo nodemailer-config.js ubicado en el directorio ../../utils/

// Función para registrar un agricultor
const register = async (req, res) => { // Define una función asíncrona llamada register que toma un objeto de solicitud (req) y un objeto de respuesta (res) como parámetros
  try { // Inicia un bloque try-catch para manejar errores
    const userDoc = new Farmer(req.body); // Crea un nuevo objeto Farmer utilizando los datos de la solicitud (req.body)
    console.log(req.body); // Imprime en la consola los datos de la solicitud (para propósitos de depuración)
    
    //validaciones
    const valEmail = await validateEmailDB(req.body.email); // Valida si el correo electrónico proporcionado ya existe en la base de datos
    console.log(valEmail); // Imprime en la consola el resultado de la validación del correo electrónico
    if (!valEmail) { // Si el correo electrónico no está registrado en la base de datos
      const valPassword = validatePassword(req.body.password); // Valida si la contraseña cumple con un patrón requerido
      if (valPassword) { // Si la contraseña es válida
        userDoc.password = bcrypt.hashSync(userDoc.password, 10); // Encripta la contraseña utilizando bcrypt
        userDoc.confirmUser = generateRandomNumber(); // Genera un número aleatorio para la confirmación del usuario
        const createdUser = await userDoc.save(); // Guarda el usuario en la base de datos

        // Enviar correo electrónico de confirmación
        await transporter.sendMail({ // Utiliza el objeto transporter para enviar un correo electrónico
          from: 'amaya.hamill47@ethereal.email', // Dirección de correo electrónico del remitente
          to: req.body.email, // Dirección de correo electrónico del destinatario (extraída de la solicitud)
          subject: 'enviado desde nodemailer', // Asunto del correo electrónico
          html:`
          <h4> Bienvenido ${req.body.name}</h4>
          <p>Haga click aqui para confirmar su cuenta <a href="http://localhost:5000/user/confirm-user/${userDoc.confirmUser}">Haga click</a></p>
          ` // Cuerpo del correo electrónico en formato HTML
        }, function(error, info){ // Callback para manejar errores y resultados del envío del correo electrónico
          if (error){ // Si hay un error al enviar el correo electrónico
            console.log(error); // Imprime el error en la consola
            res.send('error al enviar el email'); // Envía una respuesta indicando el error al cliente
          } else { // Si el correo electrónico se envía correctamente
            console.log('correo enviado' + info.response); // Imprime en la consola la respuesta del servidor de correo
            res.send('Correo enviado'); // Envía una respuesta indicando el éxito al cliente
          }
        });

        return res.status(200).json({ success: true, data: createdUser }); // Envía una respuesta JSON indicando el éxito del registro y los datos del usuario creado
      } else { // Si la contraseña no cumple con el patrón requerido
        return res.status(200).json({ success: false, message: 'La contraseña no cumple con el patron indicado' }); // Envía una respuesta JSON indicando que la contraseña no es válida
      }
    }
    return res.status(200).json({ success: false, message: 'El email ya está registrado' }); // Envía una respuesta JSON indicando que el correo electrónico ya está registrado
  } catch (error) { // Captura cualquier error que ocurra dentro del bloque try
    console.log(error); // Imprime el error en la consola
    return res.status(500).json(error); // Envía una respuesta JSON indicando un error interno del servidor
  }
};

// Función para iniciar sesión
const login = async (req, res) => { // Define una función asíncrona llamada login que toma un objeto de solicitud (req) y un objeto de respuesta (res) como parámetros
  try { // Inicia un bloque try-catch para manejar errores
    const userBody = req.body; // Extrae los datos de usuario de la solicitud
    const userDB = await validateEmailDB(userBody.email); // Verifica si el correo electrónico proporcionado existe en la base de datos
    if (!userDB) { // Si el correo electrónico no está registrado
      return res.status(200).json({ succe: false, message: 'El email no está registrado' }); // Envía una respuesta JSON indicando que el correo electrónico no está registrado
    }
    if (!bcrypt.compareSync(userBody.password, userDB.password)) { // Si la contraseña proporcionada no coincide con la almacenada en la base de datos
      return res.status(200).json({ succes: true, message: 'contraseña invalida' }); // Envía una respuesta JSON indicando que la contraseña es inválida
    }
    //generar el token
    const token = generateToken({ // Genera un token JWT utilizando la función generateToken
      name: userDB.name, // Nombre de usuario
      email: userDB.email, // Correo electrónico del usuario
      _id: userDB._id, // ID de usuario
    });
    return res.status(200).json({ success: true, token: token }); // Envía una respuesta JSON con éxito y el token generado
  } catch (error) { // Captura cualquier error que ocurra dentro del bloque try
    return res.status(500).json(error); // Envía una respuesta JSON indicando un error interno del servidor
  }
};

// Función para modificar el perfil del usuario
const modifyProfile = async (req, res) => { // Define una función asíncrona llamada modifyProfile que toma un objeto de solicitud (req) y un objeto de respuesta (res) como parámetros
  console.log('funcion de modificar'); // Imprime un mensaje en la consola (para propósitos de depuración)
  console.log(req.userProfile); // Imprime en la consola los datos de perfil del usuario (extraídos del token de autenticación)
  const newUser = new Farmer(req.body); // Crea un nuevo objeto Farmer utilizando los datos de la solicitud (req.body)
  newUser.password = bcrypt.hashSync(req.body.password, 10); // Encripta la contraseña proporcionada utilizando bcrypt
  newUser._id = req.userProfile._id; // Establece el ID del usuario en el ID extraído del token de autenticación
  console.log(newUser); // Imprime en la consola el nuevo objeto de usuario (para propósitos de depuración)
  const updateUser = await Farmer.findByIdAndUpdate( // Actualiza el perfil del usuario en la base de datos utilizando el método findByIdAndUpdate del modelo Farmer
    req.userProfile._id, // ID del usuario a actualizar
    newUser, // Nuevos datos del usuario
    { new: true } // Opciones para devolver el documento actualizado
  );
  return res.status(200).json({ data: updateUser }); // Envía una respuesta JSON con el perfil de usuario actualizado
};

// Función para obtener todos los usuarios
const getUsers = async (req, res) => { // Define una función asíncrona llamada getUsers que toma un objeto de solicitud (req) y un objeto de respuesta (res) como parámetros
  try { // Inicia un bloque try-catch para manejar errores
    const usersDB = await Farmer.find(); // Obtiene todos los usuarios de la base de datos utilizando el método find del modelo Farmer
    return res.json(usersDB); // Envía una respuesta JSON con todos los usuarios encontrados en la base de datos
  } catch (error) { // Captura cualquier error que ocurra dentro del bloque try
    console.log(error); // Imprime el error en la consola
  }
};

module.exports = { register, login, modifyProfile, getUsers }; // Exporta las funciones register, login, modifyProfile y getUsers para que estén disponibles para otros archivos

















































/*
const Farmer = require('../models/user.model');
const bcrypt = require('bcrypt');
const { validateEmailDB, validatePassword } = require('../../utils/validator');
const { generateToken } = require('../../utils/jwt');
const generateRandomNumber = require('../../utils/generateRandomNumber')
const transporter = require('../../utils/nodemailer-config');



// Función para registrar un agricultor
const register = async (req, res) => {
  try {
    // creo el documento del usuario
    const userDoc = new Farmer(req.body);
    console.log(req.body);
    
    //validaciones
    //1.- El usuario no exista. (email)
    const valEmail = await validateEmailDB(req.body.email);
    console.log(valEmail); // devuelve null si no se encuentra  en la BD
    if (!valEmail) {
      
      //2.- La contraseña cumpla el patron requerido (regex)
      const valPassword = validatePassword(req.body.password);
      if (valPassword) {
        //3.- Encriptar la contraseña antes de registrarme  HASH
        userDoc.password = bcrypt.hashSync(userDoc.password, 10);
        userDoc.confirmUser = generateRandomNumber();
        const createdUser = await userDoc.save();

        // Enviar correo electrónico de confirmación
        await transporter.sendMail({
          from: 'amaya.hamill47@ethereal.email',
          to: req.body.email,
          subject: 'enviado desde nodemailer',
          html:`
          <h4> Bienvenido ${req.body.name}</h4>
          <p>Haga click aqui para confirmar su cuenta <a href="http://localhost:5000/user/confirm-user/${userDoc.confirmUser}">Haga click</a></p>
          `
        }, function(error, info){
          if (error){
            console.log(error);
            res.send('error al enviar el email');
          }else{
            console.log('correo enviado' + info.response);
            res.send('Correo enviado');
          }
        });

        return res.status(200).json({ success: true, data: createdUser });
      } else {
        return res.status(200).json({
          success: false,
          message: 'La contraseña no cumple con el patron indicado',
        });
      }
    }
    return res
      .status(200)
      .json({ success: false, message: 'El email ya está registrado' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};


const login = async (req, res) => {
  try {
    const userBody = req.body;
    const userDB = await validateEmailDB(userBody.email);
    if (!userDB) {
      return res
        .status(200)
        .json({ succe: false, message: 'El email no está registrado' });
    }
    if (!bcrypt.compareSync(userBody.password, userDB.password)) {
      return res
        .status(200)
        .json({ succes: true, message: 'contraseña invalida' });
    }
    //generar el token
    const token = generateToken({
      name: userDB.name,
      email: userDB.email,
      _id: userDB._id,
    });
    return res.status(200).json({ success: true, token: token });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const modifyProfile = async (req, res) => {
  console.log('funcion de modificar');
  console.log(req.userProfile); // es el usuario con los datos correspondiente al token
  const newUser = new Farmer(req.body);
  newUser.password = bcrypt.hashSync(req.body.password, 10);
  newUser._id = req.userProfile._id;
  console.log(newUser);
  const updateUser = await Farmer.findByIdAndUpdate(
    req.userProfile._id,
    newUser,
    { new: true }
  );
  return res.status(200).json({ data: updateUser });
};
const getUsers = async (req, res) => {
  try {
    const usersDB = await Farmer.find();
    return res.json(usersDB);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { register, login, modifyProfile, getUsers };
*/
