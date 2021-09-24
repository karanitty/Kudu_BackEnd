const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    className:{
        type:String,
        required:true
    },
    classCode:{
        type:String,
        requied:true,
    },
    Teacher:{
        type:String,
    },
    description:{
        type:String,
        required:true
    },
    notes:[{type:Schema.Types.ObjectId, ref:'notes'}],
    assignments:[{type:Schema.Types.ObjectId, ref:'assignments'}]
});

module.exports = mongoose.model('classes',classSchema);