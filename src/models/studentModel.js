const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    pwd:{
        type:String,
        required:true
    },
    classes:[{type: Schema.Types.ObjectId, ref:'classes'}],
    // submissions:[{asid:String,submission:String}]
    submissions:[{type:Schema.Types.ObjectId,ref:'submissions'}]
});

module.exports = mongoose.model('students',studentSchema);