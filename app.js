var express = require('express');
var app = express();
var admin = express();

// app.get('/', function (req, res) {
//   res.send('hello world');
// });
// app.listen(3000, function () {
//   console.log('Listening on port 3000')
// });


admin.get('/', function (req,res) {
  console.log(admin.mountpath);
  res.send('Admin Homepage');
})

app.use('/admin', admin);
app.locals.title = "my app";

console.log(app.locals.title);
// console.log(app.locals.email);
