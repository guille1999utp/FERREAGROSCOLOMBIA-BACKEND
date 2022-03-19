const {Schema,model} = require('mongoose');
const Imagen = new Schema({
    urlImagen:  {
        type: String,
        required : true,
        trim: true,
    },
    idfoto:  {
        type: String,
        trim: true,
        unique: true
    },
    tamano:  {
        type: String,
        trim: true,
        default:'largo'
    }}
);

Imagen.method('toJSON', function(){
    const { __V, _id,...object} = this.toObject();
    object.iid = _id;
    return object;
})

module.exports = model('Imagenes', Imagen);