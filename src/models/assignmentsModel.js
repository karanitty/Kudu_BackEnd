const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
    classId:{
        type: Schema.Types.ObjectId,
        ref:'classes'
    },
    title:String,
    content:String,
});

module.exports = mongoose.model('assignments',assignmentSchema);