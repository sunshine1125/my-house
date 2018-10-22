const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const morgan = require('morgan');

const routes = require('./routes/index');
const users  = require('./routes/users');
const posts = require('./routes/posts');
const comments = require('./routes/comment');
const tags = require('./routes/tag');
const upload = require('./routes/upload');
const replies = require('./routes/reply');

app.use(express.static('public'));

// use body parser so we can get info from post or url parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(routes);
app.use('/user', users);
app.use(posts);
app.use(comments);
app.use(tags);
app.use(upload);
app.use(replies);

module.exports = app;