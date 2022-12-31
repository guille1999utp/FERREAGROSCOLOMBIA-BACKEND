const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarjwt } = require('../helpers/jwt');
const { transporter } = require('../helpers/nodeEmailer')
const Crearusuario = async (req, res = response)=>{

    try{
        const { correo, password } = req.body;
        const existecorreo = await Usuario.findOne({ correo });
        if(existecorreo){
        return res.status(400).json({
            ok:false,
            msg: 'el correo ya existe '
        })
        }
            const newuser = new Usuario(req.body);
        const salt = bcryptjs.genSaltSync();
        newuser.password = bcryptjs.hashSync(password , salt);
        await newuser.save();

        const token = await generarjwt( newuser.id)
        res.json({
            ok: true,
            newuser,
            token
        });
    }
    catch (error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'hubo fallas en la base de datos'
        })
            }
}

const InicioSesion = async (req, res = response)=>{
    const {correo, password } = req.body;
    try{
   const usuarioBd = await Usuario.findOne({correo});
   if(!usuarioBd){
       return res.status(404).json({
           ok: false,
           msg: 'email no existe'
       });
   }
   const validarcontraseña = bcryptjs.compareSync(password, usuarioBd.password)
   if(!validarcontraseña){
    return res.status(404).json({
        ok: false,
        msg: 'contraseña incorrecta'
    });
}
const token = await generarjwt( usuarioBd.id);
return res.json({
    ok: true,
    usuarioBd,
    token
});

    } catch (error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'hubo fallas en la base de datos de ferre'
        })
            }
    
}


const renovar = async (req, res = response)=>{
    const uid = req.uid;
    const token = await generarjwt(uid);
    const usuario = await  Usuario.findById(uid);
    return res.json({
    ok: true,
    usuario,
    token
});
}

const correo = async (req, res = response)=>{
    const {contact_user,correo_user, asunto_user,descripcion_user,telefono } = req.body;
    try {
           await transporter.sendMail({
            from: `"${contact_user}" <${process.env.CORREO_SECRET}>`, // sender address
            to: correo_user, // list of receivers
            subject: `${asunto_user} -> ferreagrocolombia`, // Subject line
            text: "", // plain text body
            html: ` <b>de: </b> ${correo_user}
            <br><br>
            <b>telefono: ${telefono} </b>
            <p>${descripcion_user}
            `, // html body
          });

          return res.status(200).json({
              ok:true
          })
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            ok:false
        })
    }
}

module.exports = { 
    Crearusuario,
    InicioSesion,
    renovar,
    correo
}
