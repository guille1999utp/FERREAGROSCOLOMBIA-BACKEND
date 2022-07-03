const { Router } = require('express');
const router = Router();

const { Crearusuario, InicioSesion, renovar, correo } = require('../controllers/auth');
const { check,body } = require('express-validator');
const { validacioncampos } = require('../middlewares/validador-de-campos');
const { validarjwt } = require('../helpers/regenerarjwt');


router.post('/login', [
    check('correo','El email es obligatorio').isEmail(),
    check('password','El password es obligatorio').notEmpty(),
    validacioncampos
],InicioSesion);


router.post('/register', [
    check('nombre','El nombre es obligatorio').isEmail(),
    check('correo','El correo es obligatorio').notEmpty(),
    check('password','El password es obligatorio').notEmpty(),
    check('fechnacimiento','la fecha de nacimiento es obligatorio').isDate(),
    validacioncampos
],Crearusuario);

router.post('/correo', [
    body('contact_user','El nombre es obligatorio').notEmpty(),
    body('correo_user','no es un correo').isEmail(),
    body('asunto_user','El asunto es obligatorio').notEmpty(),
    body('telefono','El telefono es obligatorio').notEmpty(),
    body('descripcion_user','la descripsion es obligatoria').notEmpty(),
    validacioncampos
],correo);

router.get('/renovacion', validarjwt , renovar );


module.exports = router;


