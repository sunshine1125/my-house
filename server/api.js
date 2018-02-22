const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const apiRoutes = express.Router();
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./models/user');
const Forms = require('./models/form');

mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret);// secret variable

apiRoutes.post('/register', (req, res) => {
    let newUser = new User({
        username: req.body.username,
        password: req.body.password,
        admin   : true
    })
    newUser.save((err, data) => {
        if (err) {
            res.status('405').json({code: 405, msg: err})
        } else {
            // res.status('200').json({code: 0, msg: 'register success'})
            const payload = {
                admin: newUser.admin
            };

            let token = jwt.sign(payload, app.get('superSecret'), {
                // expiresInMinutes: 1440  // expires in 24 hours
            });

            // return the information including token as JSON

            return res.json({
                success: true,
                message: 'register success',
                token  : token
            })
        }
    })

});

apiRoutes.post('/authentication', (req, res) => {
    console.log(req.body.username);
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.json({success: false, message: '验证失败，没有找到用户！'})
        } else if (user) {
            if (user.password != req.body.password) {
                res.json({success: false, message: '密码输入错误'})
            } else {
                const payload = {
                    admin: user.admin
                };

                let token = jwt.sign(payload, app.get('superSecret'), {
                    // expiresInMinutes: 1440  // expires in 24 hours
                });

                // return the information including token as JSON

                return res.json({
                    success: true,
                    message: 'login success',
                    token  : token
                })
            }
        }
    })
});

// route middleware to verify a token
apiRoutes.use((req, res, next) => {
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

apiRoutes.get('/forms/getData', (req, res) => {
    Forms.find()
        .exec(function (err, users) {
            res.status('200').json(users);
        });
});

apiRoutes.post('/forms/addData', (req, res, next) => {
    let id = req.body.id;
    let title = req.body.title;
    let date = req.body.date;
    Forms.findOne({title: title}, (err, data) => {
        if (err) {
            return next(err);
        }
        if (data) {
            res.status('200').json({code: 100, msg: '数据已经存在'})
        }
        let newForm = new Forms({
            title: title,
            date : date
        });

        newForm.save(next);

    });
}, (req, res) => {
    res.status('200').json({code: 0, msg: 'success'})
});

apiRoutes.put('/forms/editData/:id', (req, res) => {

    Forms.findByIdAndUpdate(req.params.id, {title: req.body.title}, (err, docs) => {
        if (err) {
            console.log(err);
        }
        res.status('200').json({code: 2000, msg: 'update success' + docs})
    });
    // Forms.update({_id: req.params.id}, {title: req.body.title}, (err, docs) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     res.status('200').json({code: 2000, msg: 'update success' + docs})
    // });
});

apiRoutes.delete('/forms/removeData/:id', (req, res) => {
    Forms.remove({_id: req.params.id}, (err, docs) => {
        if (err) {
            console.log(err);
        }
        res.status('200').json({code: 1000, msg: 'delete success' + docs})
    })

});
module.exports = apiRoutes;
