const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tables');

const db = mongoose.connection;
db.once('error', function () {
  console.log('mongo connection error');
});
db.once('open', function () {
  console.log('mongo connection success');
});
const loginSchema = mongoose.Schema({
  username: String,
  password: String
});

const Users = db.model('login', loginSchema);

module.exports = Users;
