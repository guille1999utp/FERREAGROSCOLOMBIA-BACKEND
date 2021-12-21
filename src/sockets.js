const { userconectado, userdesconectado, usuariosactivos,savemessage,subirproducto, eliminarproducto } = require("./helpers/eventoSockets");
const { comprobacionJWT } = require("./helpers/jwt");


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
          
           await userconectado(uid);

           console.log('cliente conectado')
            
            socket.join( uid );

            this.io.emit('lista-usuarios',await usuariosactivos());
            //mandar mensajes a los dos chats que se estan conectando
            socket.on('mensaje', async (payload)=>{
               const mensaje = await savemessage(payload);
               this.io.to(payload.para).emit('mensaje',mensaje);
               this.io.to(payload.de).emit('mensaje',mensaje);
            })
            //subir producto que se ordenara
            socket.on('orden', async ({solicitud, url})=>{
                solicitud.urlfoto = url.secure_url;
                solicitud.idfoto = url.public_id;
                const producto = await subirproducto(solicitud);
                this.io.emit('orden',producto);
             })
       //cuando un cliente elimina un producto 
             socket.on('eliminarorden', async (oid)=>{
                await eliminarproducto(oid);
                this.io.emit('eliminarorden',oid);
             })
             //cuando el cliente se desconecta emite a todos que el cliente se desconecto
             socket.on('disconnect',async ()=>{
                 console.log('cliente desconectado')
                await userdesconectado(uid);
                 this.io.emit('lista-usuarios',await usuariosactivos());
                })
            
        
        }
        
        );
    }


}


module.exports = Sockets;