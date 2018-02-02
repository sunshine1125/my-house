const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
const urlencodedParser = bodyParser.urlencoded({ extended: false });


let data = require('./data.json');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/data', function (req, res) {
  res.status(200).json(data);
});
app.post('/data', function (req, res) {
  //TODO
  console.log(req.body);
  res.send('success');
});

app.delete('/data', function (req, res) {
  res.send('delete');
});
app.listen(3000, function () {
  console.log('Listening on port 3000')
});
