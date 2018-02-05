const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
const urlencodedParser = bodyParser.urlencoded({ extended: false });


// let data = require('./data.json');
mongoose.connect("mongodb://localhost:27017/test");

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/data', function (req, res) {
  // res.status(200).json(data);
  res.send("get success");
});
app.post('/data', function (req, res) {
  //TODO
  console.log(req.body);
  res.send('post success');
});

app.delete('/data', function (req, res) {
  console.log(req.body);
  res.send('delete success');
});
app.listen(3000, function () {
  console.log('Listening on port 3000')
});
