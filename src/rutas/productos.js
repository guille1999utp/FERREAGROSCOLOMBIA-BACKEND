const {Router} = require('express');
const {CategoriasTodas,pedirproducto ,informacionAdicional,categoriasindividual,categorias,informacionmostrarcategoria,PagarProducto} = require('../controllers/productos');

const router = Router();
router.get('/producto/:producto',pedirproducto);
router.get('/busqueda/:busqueda',informacionAdicional);
router.get('/mostrar/:categoria',informacionmostrarcategoria);
router.get('/mostrar',categorias);
router.get('/categorias', categoriasindividual);
router.get('/categorias/:categoria', CategoriasTodas);

module.exports = router