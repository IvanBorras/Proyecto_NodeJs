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