const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {crearproducto, productosUserMostrar,crearusuario,crearCategoria} = require('../controllers/ordenes');

const router = Router();
router.get('/crearproducto', validarjwt, crearproducto);
router.get('/crearCategoria/:crear', validarjwt, crearCategoria);
router.get('/Usuarios', validarjwt, crearusuario);
router.get('/productosdeluser/:user', productosUserMostrar);
module.exports = router