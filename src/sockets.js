const {subircategoriaTodo,modificardatoscategoria,eliminarcategoria, modificardatosproducto,eliminarfotoproductoadicional,crearusuario,eliminarUser,modificarDatosUsuario,adicionarproductocomprado,eliminarparrafoproducto, adicionarParrafoproducto,adicionarfotoproducto,subirproducto, eliminarproducto,eliminarproductouser, subirproductoTodo} = require("./helpers/eventoSockets");
const { comprobacionJWT } = require("./helpers/jwt");
const cloudinary = require('./utils/cloudinary');
const {nanoid} = require('nanoid');
const Videos = require('./models/videos');

class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        this.io.on('connection', async ( socket ) => {
           const [ valido, uid ] = comprobacionJWT(socket.handshake.query['x-token']);
           if(!valido){
               console.log('socket erroneo');
               return socket.disconnect();
           }
          
           console.log('cliente conectado')
            
            socket.join( uid );
           
            //solicitud del cliente recibida,confirmacion de llegada
            socket.on('recibidoproductosolicitud', async ({productorden,de,para})=>{
                await cambiarestadochatrecibido(productorden);
                this.io.to(para).emit('recibidoproductosolicitud',de);
                this.io.to(de).emit('recibidoproductosolicitud',para);
                this.io.to(para).emit('estadorecibido');
                this.io.to(de).emit('estadorecibido');
                 }) 
                 
            //se recibio el producto con total exito
            socket.on('productorecibidoconexito', async ({productorden,de,para,dinero})=>{
                 await serecibioelproductoconexito(productorden,de,dinero);
                 this.io.to(para).emit('resetchat');
                 this.io.to(de).emit('resetchat');
                 this.io.to(para).emit('lista-usuarios',await usuariosactivos(para));
                 this.io.to(de).emit('lista-usuarios',await usuariosactivos(de));

                 }) 
      

            
            //subir producto que se ordenara
            socket.on('orden', async ({solicitud, url})=>{
                solicitud.urlfoto = url.secure_url;
                solicitud.idfoto = (url.public_id===0)?nanoid():url.public_id;
                const producto = await subirproducto(solicitud);
                const userinformar = await userinformarsolicitud(solicitud.categoria);
                this.io.to(uid).emit('orden',producto);
                for (let i = 0; i < userinformar.length; i++) {
                    const pos = userinformar[i];
                    if(pos !== uid){
                        this.io.to(pos).emit('ordenagregarsolicitud',solicitud.categoria);
                    }
                    }

             })
             //cambiar CATEGORIA producto que se mostrara
            socket.on('solicitud', async ({Categoria})=>{
                await cambiarCategoria(Categoria,uid);
             })
              //subir producto con foto 
              socket.on('producto', async ({url,uid,producto})=>{
                const urlconver = {
                    secure_url: url.secure_url,
                    public_id: url.public_id
                }
                  try{
                      const productoadi = await subirproductoTodo(urlconver,uid,producto);
                      this.io.to(uid).emit('producto',productoadi);
                  }catch (e){
                      console.log(e);
                  }
             })

             
              //subir categoria con foto 
              socket.on('categoriacrear', async ({url,producto})=>{
                  console.log(producto)
                const urlconver = {
                    secure_url: url.secure_url,
                    public_id: (url.public_id===0)?nanoid():url.public_id
                }
                  try{
                      const categoria = await subircategoriaTodo(urlconver,producto);
                      this.io.to(uid).emit('categoriacrear',categoria);
                  }catch (e){
                      console.log(e);
                  }
             })


              //crear nuevo usuario
              socket.on('newusuario', async ({producto})=>{

                try{
                    console.log(producto)
                    const productoadi = await crearusuario(uid,producto);
                    this.io.to(uid).emit('newusuario',productoadi);
                }catch (e){
                    console.log(e);
                }
           })
             //subir foto adicional de producto
             socket.on('subirfotoadicionalproducto', async ({url,pid})=>{
                const urlconver = {
                    secure_url: url.secure_url,
                    public_id: url.public_id
                }
                console.log(url,pid);
                  try{
                      await adicionarfotoproducto(urlconver,pid);
                      this.io.to(uid).emit('subirfotoadicionalproducto',urlconver);
                  }catch (e){
                      console.log(e);
                  }
             })
             
             //eliminar video
             socket.on('eliminarVideo', async ({vid})=>{
                try{
                    console.log(vid)
                    await Videos.findByIdAndDelete(vid);
                    
                }catch (e){
                    console.log(e);
                }
           })
             //subir Parrafo adicional de producto
             socket.on('subirparrafonuevo', async ({Parrafo,pid})=>{
                  try{
                      await adicionarParrafoproducto(Parrafo,pid);
                      this.io.to(uid).emit('subirparrafonuevo',Parrafo);
                  }catch (e){
                      console.log(e);
                  }
             })
    
             //eliminar Parrafo de producto
             socket.on('productoparrafoeliminar', async ({pid,index})=>{
                try{
                    await eliminarparrafoproducto(pid,index);
                    this.io.to(uid).emit('productoparrafoeliminar',index);
                }catch (e){
                    console.log(e);
                }
           })

               //eliminar foto restar producto
               socket.on('fotoproductoeliminar', async ({url,pid})=>{
                const urlconver = {
                    secure_url: url.secure_url,
                    public_id: url.public_id
                }
                  try{
                      await eliminarfotoproductoadicional(urlconver,pid);
                      this.io.to(uid).emit('fotoproductoeliminar',urlconver);
                  }catch (e){
                      console.log(e);
                  }
             })
             //modificar producto foto
             socket.on('productomodificar', async ({Producto,url})=>{
                try {     
                   await modificardatosproducto(Producto,url);
                   this.io.to(uid).emit('productomodificar',Producto);
                } catch (error) {
                    console.log(error);
                }
             })
             
              //modificar producto foto
              socket.on('categoriamodificar', async ({Producto,url})=>{
                try {     
                   await modificardatoscategoria(Producto,url);
                   this.io.to(uid).emit('categoriamodificar',Producto);
                } catch (error) {
                    console.log(error);
                }
             })
             //modificar usuario
             socket.on('usuariomodificar', async ({usuario})=>{
                try {   
                    console.log(usuario)  
                   const res = await modificarDatosUsuario(usuario);
                   if(res){
                       this.io.to(uid).emit('usuariomodificar',usuario);
                   }else{
                    this.io.to(uid).emit('usuariomodificar',usuario);
                   }
                } catch (error) {
                    console.log(error);
                }
             })

               //eliminar producto foto
               socket.on('productoeliminar', async ({uidfoto,Producto})=>{
                try {     
                    await cloudinary.cloudinary.uploader.destroy(uidfoto[0].public_id, {type : 'upload', resource_type : 'image'}, (res)=>{
                        return res;
                   });
                   await eliminarproductouser(Producto.pid);
                   this.io.to(Producto.de).emit('productoeliminar',Producto.pid);
                } catch (error) {
                    console.log(error);
                }
             })

             //eliminar producto foto
             socket.on('categoriaeliminar', async ({uidfoto,Producto})=>{
                try {     
                    await cloudinary.cloudinary.uploader.destroy(uidfoto, {type : 'upload', resource_type : 'image'}, (res)=>{
                        return res;
                   });
                   await eliminarcategoria(Producto.cid);
                   this.io.to(uid).emit('categoriaeliminar',Producto.cid);
                } catch (error) {
                    console.log(error);
                }
             })

         //eliminar usuario
         socket.on('usuarioEliminar', async ({Producto})=>{
            try {     
               await eliminarUser(Producto.uid);
               console.log(Producto)
               this.io.to(uid).emit('usuarioEliminar',Producto.uid);

            } catch (error) {
                console.log(error);
            }
         })
            //cuando un cliente elimina un producto 
             socket.on('eliminarorden', async ({oid,idfoto})=>{
                 try {     
                     const informarActivo = await eliminarproducto(oid,idfoto);
                     for (let i = 0; i < informarActivo.length; i++) {
                        const pos = informarActivo[i];
                        if(pos !== uid){
                        this.io.to(pos).emit('resetchat');
                        this.io.to(pos).emit('lista-usuarios',await usuariosactivos(pos));
                        }
                    }
                    this.io.to(uid).emit('lista-usuarios',await usuariosactivos(uid));
                     this.io.emit('eliminarorden',oid);
                 } catch (error) {
                     console.log(error);
                 }
             });
              //cuando un cliente selecciona un producto del chat
              socket.on('desactivarproducto', async ({oid,para})=>{
                try {     
                    await desactivarproducto(oid);
                    this.io.to(para).emit('desactivarproducto',true);
                } catch (error) {
                    console.log(error);
                }
            });
             //cuando el cliente se desconecta emite a todos que el cliente se desconecto
             socket.on('disconnect',async ()=>{
                 console.log('cliente desconectado')
                await userdesconectado(uid);
                 const res = await usuariosactivos(uid);
                 for (let i = 0; i < res.length; i++) {
                    const pos = res[i]._id + '';
                    if(pos !== uid){
                    this.io.to(pos).emit('lista-usuarios',await usuariosactivos(pos));
                    }
                }
                })
        }
        );
        
    }


}


module.exports = Sockets;