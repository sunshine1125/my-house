const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const apiRoutes = express.Router();
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./models/user');
const Forms = require('./models/form');
const nodemailer = require('nodemailer');
let mailTransport = nodemailer.createTransport({
    host            : 'smtp.qq.com',
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    auth            : {
        user: '371262808@qq.com',
        pass: 'xxxxxxxxxxx你的授权码'
    },
});

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

apiRoutes.get('/sendEmail', (req, res) => {
    let options = {
        from   : '"测试" <371262808@qq.com>',
        to     : '"测试" <371262808@qq.com>',
        subject: '一封来自sunshine1125的邮件',
        text   : '一封来自sunshine1125的邮件',
        html   : '<h1>你好，欢迎加入我们！</h1>' +
                 '<p>请点击下面的按钮激活你的账户</p>' +
                 '<a href="http://localhost:8080">点击激活账号</a>'

    };
    mailTransport.sendMail(options, (err, msg) => {
        if (err) {
            console.log(err);
            res.send('发送失败' + err);
        } else {
            console.log(msg);
            res.send('发送成功' + msg);
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
    Forms.findOne({id: id}, (err, user) => {
        if (err) {
            return next(err);
        }
        if (user) {
            res.status('200').json({code: 100, msg: '数据已经存在'})
        }
        let newForm = new Forms({
            id   : id,
            title: title,
            date : date
        });

        newForm.save(next);

    });
}, (req, res) => {
    res.status('200').json({code: 0, msg: 'success'})
});

apiRoutes.put('/forms/editData/:id', (req, res) => {
    Forms.update({id: req.params.id}, {title: req.body.title}, (err, docs) => {
        if (err) {
            console.log(err);
        }
        res.status('200').json({code: 2000, msg: 'update success' + docs})
    });
});

apiRoutes.delete('/forms/removeData/:id', (req, res) => {
    Forms.remove({id: req.params.id}, (err, docs) => {
        if (err) {
            console.log(err);
        }
        res.status('200').json({code: 1000, msg: 'delete success' + docs})
    })

});
module.exports = apiRoutes;
