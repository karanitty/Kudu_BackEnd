const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    asid:[{type:Schema.Types.ObjectId,ref:'assignments'}],
    sid:[{type:Schema.Types.ObjectId, ref:'students'}],
    submission:{type:String}
});

module.exports = mongoose.model('submissions',submissionSchema);