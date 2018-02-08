const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/form_mange');

const db = mongoose.connection;
db.once('error', function () {
  console.log('mongo connection error');
});
db.once('open', function () {
  console.log('mongo connection success');
});
const formSchema = mongoose.Schema({
  id   : {type: String, require: true, unique: true},
  title: {type: String},
  date : {type: Date}
});

const Forms = db.model('form', formSchema);

module.exports = Forms;
