const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const mongoose = require('mongoose');
const auth = require('./controller/auth');
const post = require('./controller/post');
const tag = require('./controller/tag');
let config = process.env.NODE_ENV === 'development' ? require('./config/dev') : require('./config/prod')

app.use(express.static('public'));
// use body parser so we can get info from post or url parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect(config().databaseConnect().database); // connect to database
app.set('superSecret', config().databaseConnect().secret);// secret variable

// use morgan to log requests to the console
app.use(morgan('dev'));

// auth api
app.use(auth);

// controller middleware to verify a token
app.use((req, res, next) => {
    // check header or url parameters or post parameters for token
    // let token = req.body.token || req.query.token || req.headers['x-access-token'];
    let token = req.headers.authorization;

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

// post api
app.use(post);

// tag api
app.use(tag);

const PORT = process.env.NODE_ENV.PORT || 3003

app.listen(PORT);
console.log('success listen on port ' + PORT);
