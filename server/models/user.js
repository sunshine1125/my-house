const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username          : String,
  password          : String,
  email             : String,
  admin             : Boolean,
  userTypeId        : Number,
  userType          : String,
  confirmation_token: String,
  changePassword    : Boolean,
  posts             : [{type: Schema.Types.ObjectId, ref: 'Post'}]
});

let User = mongoose.model('User', UserSchema);

module.exports = User;
