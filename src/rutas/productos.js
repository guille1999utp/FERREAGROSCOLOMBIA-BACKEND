const {Router} = require('express');
const {pedirproducto ,informacionAdicional,categoriasindividual,categorias,informacionmostrarcategoria,PagarProducto,FeedBack,PagarServicios} = require('../controllers/productos');
const {validarjwt} = require('../helpers/regenerarjwt');

const router = Router();
router.get('/producto/:producto',pedirproducto);
router.get('/busqueda/:busqueda',informacionAdicional);
router.get('/mostrar/:categoria',informacionmostrarcategoria);
router.get('/mostrar',categorias);
router.get('/categorias', categoriasindividual);
router.post('/comprar/:id',validarjwt,PagarProducto);
router.get('/pagar',validarjwt,PagarServicios);
router.get('/feedback', validarjwt, FeedBack);

module.exports = router