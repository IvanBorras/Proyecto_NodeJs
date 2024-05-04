const Farmer = require('../models/user.model');
const bcrypt = require('bcrypt');
const { validateEmailDB, validatePassword } = require('../../utils/validator');
const { generateToken } = require('../../utils/jwt');
const generateRandomNumber = require('../../utils/generateRandomNumber');
const transporter = require('../../utils/nodemailer-config');

// Función para registrar un nuevo usuario
const register = async (req, res) => {
  try {
    const userDoc = new Farmer(req.body); // Crea un nuevo objeto de usuario con los datos proporcionados en la solicitud
    const valEmail = await validateEmailDB(req.body.email); // Valida si el correo electrónico ya está registrado en la base de datos
    if (!valEmail) {
      const valPassword = validatePassword(req.body.password); // Valida si la contraseña cumple con los requisitos
      if (valPassword) {
        userDoc.password = bcrypt.hashSync(userDoc.password, 10); // Encripta la contraseña antes de almacenarla en la base de datos
        userDoc.confirmUser = generateRandomNumber(); // Genera un número aleatorio para la confirmación del usuario
        const createdUser = await userDoc.save(); // Guarda el usuario en la base de datos

        // Envía un correo electrónico de confirmación
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
          } else {
            console.log('correo enviado' + info.response);
            res.send('Correo enviado');
          }
        });

        return res.status(200).json({ success: true, data: createdUser }); // Retorna el usuario creado en la respuesta
      } else {
        return res.status(200).json({ success: false, message: 'La contraseña no cumple con el patrón indicado' });
      }
    }
    return res.status(200).json({ success: false, message: 'El email ya está registrado' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// Función para iniciar sesión
const login = async (req, res) => {
  try {
    const userBody = req.body;
    const userDB = await validateEmailDB(userBody.email);
    if (!userDB) {
      return res.status(200).json({ success: false, message: 'El email no está registrado' });
    }
    if (!bcrypt.compareSync(userBody.password, userDB.password)) {
      return res.status(200).json({ success: true, message: 'Contraseña incorrecta' });
    }
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

// Función para modificar el perfil del usuario
const modifyProfile = async (req, res) => {
  try {
    const newUser = new Farmer(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10);
    newUser._id = req.userProfile._id;
    const updateUser = await Farmer.findByIdAndUpdate(req.userProfile._id, newUser, { new: true });
    return res.status(200).json({ data: updateUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// Función para obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const usersDB = await Farmer.find();
    return res.json(usersDB);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { register, login, modifyProfile, getUsers };
