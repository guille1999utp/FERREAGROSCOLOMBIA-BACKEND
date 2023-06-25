const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {crearproducto, productosUserMostrar,crearusuario,crearCategoria, productoPrincipal} = require('../controllers/ordenes');

const router = Router();
router.get('/crearproducto', validarjwt, crearproducto);
router.get('/crearproductoprincipal', productoPrincipal);
router.get('/crearCategoria/:crear', validarjwt, crearCategoria);
router.get('/Usuarios', validarjwt, crearusuario);
router.get('/productosdeluser/:user', productosUserMostrar);
module.exports = router