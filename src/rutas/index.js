const { Router } = require('express');
const router = Router();

const { Crearusuario, InicioSesion, renovar, correo } = require('../controllers/auth');
const { check } = require('express-validator');
const { validacioncampos } = require('../middlewares/validador-de-campos');
const { validarjwt } = require('../helpers/regenerarjwt');


router.post('/login', [
    check('email','El email es obligatorio').isEmail(),
    check('password','El password es obligatorio').isEmpty().not(),
    validacioncampos
],InicioSesion);


router.post('/register', [
    check('nombre','El nombre es obligatorio').isEmail(),
    check('correo','El correo es obligatorio').isEmpty().not(),
    check('password','El password es obligatorio').isEmpty().not(),
    check('fechnacimiento','la fecha de nacimiento es obligatorio').isDate(),
    validacioncampos
],Crearusuario);

router.post('/correo', [
    check('contact_user','El nombre es obligatorio').isEmail(),
    check('correo_user','El correo es obligatorio').isEmpty(),
    check('asunto_user','El asunto es obligatorio').isEmpty(),
    check('descripcion_user','la descripsion es obligatoria').isEmpty().not(),
    validacioncampos
],correo);

router.get('/renovacion', validarjwt , renovar );


module.exports = router;


