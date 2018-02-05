const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
const urlencodedParser = bodyParser.urlencoded({extended: false});


// let data = require('./data.json');
let db = mongoose.createConnection("mongodb://localhost:27017/test");

const userSchema = mongoose.Schema({
  id    : {type: String, require: true, unique: true},
  title : {type: String},
  date  : {type: Date}
});

let User = db.model('mongoose', userSchema);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/data', function (req, res) {
  // res.status(200).json(data);
  User.find()
    .exec(function (err, users) {
      res.status('200').json(users);
    });
  // res.send("get success");
});
app.post('/data', function (req, res, next) {
  console.log(req.body);
  let id = req.body.id;
  let title = req.body.title;
  let date = req.body.date;
  User.findOne({id: id}, function (err, user) {
    if (err) {
      return next(err);
    }
    console.log(user);
    if (user) {
      res.status('200').json({code: 100, msg: '数据已经存在'})
    }
    let newUser = new User({
      id    : id,
      title : title,
      date  : date
    });

    newUser.save(next);

  });
}, function (req, res) {
  res.status('200').json({code: 0, msg: 'success'})
});

app.delete('/data', function (req, res) {
  console.log(req.body);
  res.send('delete success');
});


app.listen(3000, function () {
  console.log('Listening on port 3000')
});
