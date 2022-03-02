const Producto = require('../models/producto');
const Usuarios = require('../models/usuario');
const cloudinary = require('../utils/cloudinary');
const bcryptjs = require('bcryptjs');

const subirproductoTodo = async(url,uid,producto) =>{
    const newproducto = {
        de: uid,
        titulo: producto.titulo,
        detalles: {
            Age: producto.Age,
            Categoria: producto.Categoria,
            Ubicaion: producto.Ubicaion,
            DomicilioIncluido: producto.Domicilio,
            Garantia: producto.Garantia,
            Precio: producto.Precio,
            Cantidad: producto.Cantidad
        },
        fotosdescripsion: [url],
        textdescripsion: producto.descripsion
    }
    try{
          const producto = new Producto(newproducto);
          await producto.save();
          return producto;
      } catch (error) {
       console.log(error);
      }
       
   }

   const crearusuario = async(uid,user) =>{
    try{
        const { correo, password } = user;
        const existecorreo = await Usuarios.findOne({ correo });
        if(existecorreo){
        return {
            ok:false,
            msg: 'el correo ya existe'
        }
        }
        const usuario = new Usuarios(user);
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password , salt);
        await usuario.save();

        return usuario;
      } catch (error) {
       console.log(error);
      }
       
   }

   const adicionarfotoproducto = async(url,pid) =>{
       try{
            await Producto.findByIdAndUpdate(pid,{
            $addToSet: { fotosdescripsion : {secure_url:url.secure_url, public_id: url.public_id} }  
           });
        } catch (error) {
            console.log(error);
        }
   }


   const adicionarParrafoproducto = async(Parrafo,pid) =>{
    try{
        await Producto.findByIdAndUpdate(pid,{
         $addToSet: { textdescripsion : Parrafo }  
        });
     } catch (error) {
         console.log(error);
     }
}

const eliminarparrafoproducto = async(pid,index) =>{
    const eliminar = index-1;
    try{
          await Producto.findByIdAndUpdate(pid,{
            $pop: { textdescripsion : eliminar }  
           });
     } catch (error) {
         console.log(error);
     }
}


   const eliminarfotoproductoadicional = async(url,pid) =>{
    try{
        await Producto.findByIdAndUpdate(pid,{
         $pull: { fotosdescripsion : {public_id: url.public_id} }  
        });

        await cloudinary.cloudinary.uploader.destroy(url.public_id, {type : 'upload', resource_type : 'image'}, (res)=>{
            return res;
       });
     } catch (error) {
         console.log(error);
     }
    }


   const eliminarproductouser = async(pid) =>{
    try {
       await Producto.findOneAndDelete({_id: pid});
      } catch (error) {
       console.log(error);
      }
       
   }

   const eliminarUser = async(uid) =>{
    try {
       await Usuarios.findOneAndDelete({_id: uid});
      } catch (error) {
       console.log(error);
      }
       
   }

   const modificardatosproducto = async(producto,url) =>{
    try {
        console.log(producto)

       if(url !== null){
        const ap = await cloudinary.cloudinary.uploader.destroy(producto.fotosdescripsion[0].public_id, {type : 'upload', resource_type : 'image'}, (res)=>{
            return res;
       });
       console.log(ap)
        producto.fotosdescripsion[0] = {
            secure_url: url.secure_url,
            public_id: url.public_id
        }
    }

       await Producto.findByIdAndUpdate(producto.pid,producto);
      } catch (error) {
       console.log(error);
      }
       
   }

   const modificarDatosUsuario = async(usuario) =>{
    try {
       const usermodify = await Usuarios.findById(usuario.uid);
       if(usuario.password === usermodify.password){
           await Usuarios.findByIdAndUpdate(usuario.uid,usuario);
       }else{
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(usuario.password , salt);  
        await Usuarios.findByIdAndUpdate(usuario.uid,usuario);
       }
      } catch (error) {
       console.log(error);
      }
       
   }

module.exports = {
    modificardatosproducto,
    eliminarfotoproductoadicional,
    subirproductoTodo,
    eliminarproductouser,
    adicionarfotoproducto,
    eliminarparrafoproducto,
    adicionarParrafoproducto,
    crearusuario,
    eliminarUser,
    modificarDatosUsuario
}