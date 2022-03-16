const {Schema,model} = require('mongoose');
const userSchema = new Schema({
    nombre:  {
        type: String,
        required : true,
        trim: true,
    },
    online:{
        type: Boolean,
        required : true,
        default: false
    },
    correo:{
        type: String,
        required : true,
        unique: true,
        trim: true
    },
    password:{
       type: String,
       required : true,

    },
    rol:{
        type: String,
        trim: true,
        default: 'Repuestos'
    },
    creacion : {
        type: Date,
        default: Date.now
    }}
);

userSchema.method('toJSON', function(){
    const { __V, _id,...object} = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Usuario', userSchema);