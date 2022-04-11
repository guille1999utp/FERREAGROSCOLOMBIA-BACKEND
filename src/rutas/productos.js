const {Router} = require('express');
const {CategoriasTodas,pedirproducto ,categoriasPersonalizadas,categoriasPersonalizadashijos,informacionAdicional,categoriasindividual,categorias,informacionmostrarcategoria,ImagenesTodos,VideosTodos,SubirUrl} = require('../controllers/productos');

const router = Router();
router.get('/producto/:producto',pedirproducto);
router.get('/busqueda/:busqueda',informacionAdicional);
router.get('/mostrar/:categoria',informacionmostrarcategoria);
router.get('/mostrar',categorias);
router.get('/categorias', categoriasindividual);
router.get('/categorias/:hijos', categoriasPersonalizadas);
router.get('/mostrarsubcategorias/:hijos', categoriasPersonalizadashijos);
router.post('/categoria/:familia', CategoriasTodas);
router.get('/videos', VideosTodos);
router.post('/videos', SubirUrl);
router.get('/imagenes', ImagenesTodos);


module.exports = router