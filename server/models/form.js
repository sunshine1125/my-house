const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Form', new Schema({
    id   : {type: String, require: true, unique: true},
    title: {type: String},
    date : {type: Date}
}));



