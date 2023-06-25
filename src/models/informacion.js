const {Schema,model} = require('mongoose');
const Informacion = new Schema({
    urlBanner:  {
        type: String,
        trim: true,
    },
    idBanner:  {
        type: String,
        trim: true,
        unique: true
    },
    urlfotosomos:  {
        type: String,
        trim: true,
    },
    idfotosomos:  {
        type: String,
        trim: true,
        unique: true
    },
    urlVision:  {
        type: String,
        trim: true,
    },
    idVision:  {
        type: String,
        trim: true,
        unique: true
    },
    urlFundacion:  {
        type: String,
        trim: true,
    },
    idFundacion:  {
        type: String,
        trim: true,
        unique: true
    },
    somosText: {
        type: String,
        trim: true,
        default:''
    },
    visionText: {
        type: String,
        trim: true,
        default:''
    },
    FundacionText: {
        type: String,
        trim: true,
        default:''
    },
    productPrincipal: {
        type: String,
        trim: true,
        default:''
    }
}
);

Informacion.method('toJSON', function(){
    const { __V, _id,...object} = this.toObject();
    object.ifid = _id;
    return object;
})

module.exports = model('Informacion', Informacion);