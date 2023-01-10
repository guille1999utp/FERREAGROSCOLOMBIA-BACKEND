const Producto = require('../models/producto');
const Imagenes = require('../models/Imagenes');

const Categoria = require('../models/categoria');
const Usuarios = require('../models/usuario');
const cloudinary = require('../utils/cloudinary');
const bcryptjs = require('bcryptjs');
const Informacion = require('../models/informacion');


const userconectado = async(uid) =>{
    const usuario = await Usuarios.findById(uid);
    usuario.online = true;
    await usuario.save();

}

const subirproductoTodo = async(url,uid,producto) =>{
    const newproducto = {
        de: uid,
        titulo: producto.titulo,
        detalles: [{
            Age: producto.Age,
            Familia:producto.Familia,
            subCategoria: producto.subCategoria,
            Categoria: producto.Categoria,
            Precio: producto.Precio,
            PrecioD: producto.PrecioD
        }],
        fotosdescripsion: [url],
        textdescripsion: producto.descripsion
    }
    try{
          const consulta = await Producto.find({titulo: newproducto.titulo});
          if(consulta.length > 0) throw Error("nombre de producto existe");
          const producto = new Producto(newproducto);
          const res = await producto.save();
          newproducto.ok = true;
          newproducto.pid = res._id + "";
          return newproducto;
      } catch (error) {
           newproducto.ok = false;
       if(error.message === "nombre de producto existe"){
           newproducto.msg = error.message;
       }else{
            newproducto.msg = "error al subir el archivo";
       }
       return newproducto;
      }
       
   }

   
const subircategoriaTodo = async(url,producto) =>{
    const newcategoria = {
            categoria: producto.Categoria,
            mostrar: producto.mostrar,
            urlfoto: url.secure_url,
            uidfoto: url.public_id,
            familia: producto.familia,
            hijo: producto.hijo
    }
    try{
          const categoria = new Categoria(newcategoria);
          await categoria.save();
          return categoria;
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

   

   
   const adicionarFotoGaleria = async(url) =>{
    try{
         const image = new Imagenes({
            urlImagen: url.secure_url,
            idfoto: url.public_id,
            tamano:"largo"
        });
        image.save();
        return image;
     } catch (error) {
         console.log(error);
     }
}

   
const adicionarFotoGaleriaInformacion = async(url,foto) =>{
    let informacion;
    try{
        if(foto === "urlfotosomos"){
             informacion =  Informacion.findOneAndUpdate({
                urlfotosomos: url.secure_url,
                idfotosomos: url.public_id,
           });
        }
        if(foto === "urlVision"){
             informacion =  Informacion.findOneAndUpdate({
                urlVision: url.secure_url,
                idVision: url.public_id,
           });
        }
        if(foto === "urlFundacion"){
             informacion =  Informacion.findOneAndUpdate({
                urlFundacion: url.secure_url,
                idFundacion: url.public_id,
           });
        }

        return informacion;
     } catch (error) {
         console.log(error);
     }
}

const adicionarInformacionText = async(modificar) =>{
    try{
         const informacion =  Informacion.findOneAndUpdate(modificar);
        return informacion;
     } catch (error) {
         console.log(error);
     }
}

   const adicionarParrafoproducto = async(Parrafo,pid) =>{
    try{
        await Producto.findByIdAndUpdate(pid,{
         $push: { textdescripsion : Parrafo }  
        });
     } catch (error) {
         console.log(error);
     }
}

const eliminarparrafoproducto = async(pid,index) =>{
        try{
            const producto = await Producto.findById(pid);
            if (!producto) {
              return false;
            }
            const textdescripsion = producto.textdescripsion;
            if (!textdescripsion || textdescripsion.length === 0) {
              return false;
            }

            const updatedTextdescripsion = textdescripsion.filter((elem, i) => i !== index);

            await Producto.findByIdAndUpdate(pid, {
              $set: { textdescripsion: updatedTextdescripsion }
            });
          return true;
        } catch (error) {
            console.log(error);
            return false;
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

   const eliminarcategoria = async(cid) =>{
    try {
       await Categoria.findOneAndDelete({_id: cid});
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

   const modificardatoscategoria = async(producto,url) =>{
    try {
        console.log(producto)

       if(url !== null){
        const ap = await cloudinary.cloudinary.uploader.destroy(producto.uidfoto, {type : 'upload', resource_type : 'image'}, (res)=>{
            return res;
       });
       console.log(ap)
        producto.urlfoto = url.secure_url;
        producto.uidfoto = url.public_id;
        
    }

       await Categoria.findByIdAndUpdate(producto.cid,producto);
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
       return true;
      } catch (error) {
       console.log(error);
       return false
      }
       
   }

   const userdesconectado = async(uid) =>{
    const usuario = await Usuarios.findById(uid);
    usuario.online = false;
    await usuario.save();
    return usuario;
}
module.exports = {
    userdesconectado,
    modificardatosproducto,
    eliminarfotoproductoadicional,
    subirproductoTodo,
    eliminarproductouser,
    adicionarfotoproducto,
    eliminarparrafoproducto,
    adicionarParrafoproducto,
    crearusuario,
    eliminarUser,
    modificarDatosUsuario,
    subircategoriaTodo,
    modificardatoscategoria,
    eliminarcategoria,
    userconectado,
    adicionarFotoGaleria,
    adicionarFotoGaleriaInformacion,
    adicionarInformacionText
}