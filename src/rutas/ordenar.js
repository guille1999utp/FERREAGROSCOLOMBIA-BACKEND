const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {crearproducto, productosUserMostrar,crearusuario} = require('../controllers/ordenes');

const router = Router();
router.get('/crearproducto', validarjwt, crearproducto);
router.get('/Usuarios', validarjwt, crearusuario);
router.get('/productosdeluser/:user', productosUserMostrar);
module.exports = router