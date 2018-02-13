const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const api = require('./api');

// use body parser so we can get info from post or url parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(api);
app.listen(3000);
console.log('success listen on port 3000');
