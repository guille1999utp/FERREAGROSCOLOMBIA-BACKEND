const {Schema,model} = require('mongoose');
const categoriaSchema = new Schema({
    categoria:  {
        type: String,
        required : true,
        trim: true,
    },
    
    mostrar:{
        type: String,
        required : true,
        trim: true
    },
    urlfoto: {
        type: String,
        trim: true,
        default: 'https://res.cloudinary.com/dmgfep69f/image/upload/v1640536316/orgeial7kefv2dzsdqqt.webp'
    },
    uidfoto:  {
        type: String,
        trim: true,
        unique: true
    }}
);

categoriaSchema.method('toJSON', function(){
    const { __V, _id,...object} = this.toObject();
    object.cid = _id;
    return object;
})

module.exports = model('Categoria', categoriaSchema);