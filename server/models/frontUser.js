const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username          : String,
  password          : String,
  phone             : Number,
  roleId            : Number
});

let frontUser = mongoose.model('frontUser', UserSchema);

module.exports = frontUser;
