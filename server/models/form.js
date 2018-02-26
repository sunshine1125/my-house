const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Form', new Schema({
    title: String,
    date : Date
}));



