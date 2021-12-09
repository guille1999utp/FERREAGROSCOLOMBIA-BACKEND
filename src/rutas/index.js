const { Router } = require('express');
const router = Router();

const { Crearusuario, InicioSesion } = require('../controllers/auth');
const { check } = require('express-validator');
const { validacioncampos } = require('../middlewares/validador-de-campos');

/* router.get('/users',async(req, res)=>{
    const usuarios = await Usuario.find();
    res.json(usuarios);
}); */


/* router.put('/user/:id',async(req, res)=>{
  const user = req.params.id;
  const { nombre , password , fechnacimiento} = req.body;
  await Usuario.findByIdAndUpdate(user, {
      nombre,
      password,
      fechnacimiento
  })
  res.json({
    message : 'actualizado'
});
});
 */
router.post('/Login', [
    check('email','El email es obligatorio').isEmail(),
    check('password','El password es obligatorio').isEmpty().not(),
    validacioncampos
],InicioSesion);


router.post('/Register', [
    check('nombre','El nombre es obligatorio').isEmail(),
    check('correo','El correo es obligatorio').isEmpty().not(),
    check('password','El password es obligatorio').isEmpty().not(),
    check('fechnacimiento','la fecha de nacimiento es obligatorio').isDate(),
    validacioncampos
],Crearusuario);


router.delete('/user/:id',async (req, res)=>{
   await Usuario.findByIdAndDelete(req.params.id);
   res.json({
    message : 'usuario eliminado'
});
});


module.exports = router;


