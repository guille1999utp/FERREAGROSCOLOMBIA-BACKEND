const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const Sockets  = require('./src/sockets');
const socketio = require('socket.io')
require('dotenv').config();
require('./src/database');
const app = express();
const server = http.createServer(app);
const io = socketio(server , { });
app.set('port', process.env.PORT);
new Sockets(io);
app.use(express.static(path.resolve(__dirname, '../public')));
app.use(cors());
app.use(express.json());

//rutas
app.use(require('./src/rutas/index'))
app.use(require('./src/rutas/ordenar'))
app.use(require('./src/rutas/perfil'))
app.use(require('./src/rutas/productos'))


server.listen(app.get('port'),()=>{
    console.log('escuchando en el puerto ', app.get('port'));
});