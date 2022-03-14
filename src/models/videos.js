const {Schema,model} = require('mongoose');
const videosSchema = new Schema({
    urlvideo:  {
        type: String,
        required : true,
        trim: true,
    }}
);

videosSchema.method('toJSON', function(){
    const { __V, _id,...object} = this.toObject();
    object.vid = _id;
    return object;
})

module.exports = model('Videos', videosSchema);