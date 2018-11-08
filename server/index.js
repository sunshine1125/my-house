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
const comment_like = require('./routes/comment_like');
const post_like = require('./routes/post_like');
const users_follow = require('./routes/users_follow');
const message = require('./routes/message');
const private_message = require('./routes/private_message');
const private_message_list = require('./routes/private_message_list');

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
app.use(comment_like);
app.use(post_like);
app.use(users_follow);
app.use(message);
app.use(private_message);
app.use(private_message_list);

module.exports = app;