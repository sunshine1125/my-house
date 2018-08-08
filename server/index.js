const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const mongoose = require('mongoose');
// const auth = require('./controller/auth2');
// const post = require('./controller/post2');
const tag = require('./controller/tag');
const frontUser = require('./controller/frontUser');
const comment = require('./controller/comment');
const replyInfo = require('./controller/replyInfo');
const user = require('./controller/user');
const post = require('./controller/post');

let config = process.env.NODE_ENV === 'development' ? require('./config/dev') : require('./config/prod')

app.use(express.static('public'));
// use body parser so we can get info from post or url parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect(config.MongoDB.database); // connect to database
app.set('superSecret', config.MongoDB.secret);// secret variable

// use morgan to log requests to the console
app.use(morgan('dev'));

// auth api
app.use(user);

// app.use(frontUser);

// post api
app.use(post);

// tag api
// app.use(tag);

// controller middleware to verify a token
// app.use((req, res, next) => {
//     // check header or url parameters or post parameters for token
//     // let token = req.body.token || req.query.token || req.headers['x-access-token'];
//     let token = req.headers.authorization;
//
//     // decode token
//     if (token) {
//
//         // verifies secret and checks exp
//         jwt.verify(token, app.get('superSecret'), function (err, decoded) {
//             if (err) {
//                 return res.json({success: false, message: 'Failed to authenticate token.'});
//             } else {
//                 // if everything is good, save to request for use in other routes
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//
//     } else {
//
//         // if there is no token
//         // return an error
//         return res.status(403).send({
//             success: false,
//             message: 'No token provided.'
//         });
//     }
// });

// comment api
app.use(comment);

// reply api
app.use(replyInfo);

const PORT = process.env.NODE_ENV.PORT || 3002

app.listen(PORT);
