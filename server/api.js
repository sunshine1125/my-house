const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const apiRoutes = express.Router();
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./models/user');
const Forms = require('./models/form');

mongoose.connect(config().databaseConnect().database); // connect to database
app.set('superSecret', config().databaseConnect().secret);// secret variable

apiRoutes.post('/register', (req, res) => {
    let newUser = new User({
        username          : req.body.username,
        password          : req.body.password,
        email             : req.body.email,
        confirmation_token: config().getconfirToken(),
        changePassword    : false,
        admin             : true
    });
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (user) {
            res.json({success: false, message: '该邮箱已经注册，请直接登录！'})
        } else {
            newUser.save((err, data) => {
                if (err) {
                    res.status('405').json({code: 405, msg: err})
                } else {
                    return res.json({
                        success: true,
                        message: '注册成功',
                    })
                }
            })
        }
    });

});

apiRoutes.post('/sendEmail', (req, res) => {
    let options = {
        from   : '"测试" <371262808@qq.com>',
        to     : '"测试"' + req.body.email,
        subject: '一封来自sunshine1125的邮件',
        text   : '一封来自sunshine1125的邮件',
        html   : `<h1>你好，欢迎加入我们！</h1>
                  <p>请点击下面的按钮激活你的账户</p>
                  <a href="http://localhost:3000/checkActive/?email=${req.body.email}">点击激活账号</a>`
    };

    let mailTransport = config().emailConfig();
    mailTransport.sendMail(options, (err, msg) => {
        if (err) {
            console.log(err);
            res.json({success: false, message: '发送失败！'})
        } else {
            console.log(msg);
            res.json({success: true, message: '发送成功！'})
        }
    })
});

apiRoutes.post('/setPassword', (req, res) => {
    let options = {
        from   : '"测试" <371262808@qq.com>',
        to     : '"测试"' + req.body.email,
        subject: '一封来自sunshine1125的邮件',
        text   : '一封来自sunshine1125的邮件',
        html   : `<h1>修改密码</h1>
                  <p>确认修改密码吗？</p>
                  <a href="http://localhost:3000/checkPassword/?email=${req.body.email}">修改密码</a>`
    };

    let mailTransport = config().emailConfig();
    mailTransport.sendMail(options, (err, msg) => {
        if (err) {
            console.log(err);
            res.json({success: false, message: '发送失败！'});
        } else {
            console.log(msg);
            res.json({success: true, message: '发送成功！'});
        }
    })
});

apiRoutes.get('/checkActive', (req, res) => {
    User.update({email: req.query.email}, {confirmation_token: null}, (err, doc) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect('http://localhost:8080/#/login?passedCheck=true')
        }
    })
});

apiRoutes.get('/checkPassword', (req, res) => {
    User.update({email: req.query.email}, {changePassword: true}, (err, doc) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect('http://localhost:8080/#/setPassword')
        }
    })
});

apiRoutes.post('/singleUser', (req, res) => {
    User.update({email: req.body.email}, {password: req.body.password}, (err, docs) => {
        if (err) {
            console.log(err);
        }
        res.status('200').json({code: 200, success: true, msg: '密码修改成功'})
    });
});

apiRoutes.get('/canChangePassword/:email', (req, res) => {
    User.findOne({
        email: req.params.email
    }, function (err, user) {
        if (!user.changePassword) {
            res.json({success: false, message: '邮箱验证失败！'})
        } else {
            res.json({success: true, message: '邮箱验证成功！'})
        }
    })
});

apiRoutes.put('/canChangePassword', (req, res) => {
    User.update({email: req.body.email}, {changePassword: false}, (err, doc) => {
        if (err) {
            res.send(err);
        }
    })
});

apiRoutes.post('/authentication', (req, res) => {
    User.findOne({
        email: req.body.username
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.json({success: false, check: true, message: '验证失败，没有找到用户！'})
        } else if (user) {
            if (user.password != req.body.password) {
                res.json({success: false, check: true, message: '密码输入错误'})
            } else if (user.confirmation_token) {
                res.json({success: false, check: false, message: '邮箱验证失败，请重新验证！'});
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
                    message: '登录成功',
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
        .exec(function (err, data) {
            res.status('200').json(data);
        });
});

apiRoutes.post('/forms/addData', (req, res, next) => {
    let title = req.body.title;
    let date = req.body.date;
    Forms.findOne({title: title}, (err, data) => {
        if (err) {
            return next(err);
        }
        if (data) {
            res.status('200').json({success: false, code: 100, msg: '数据已经存在'})
        }
        let newForm = new Forms({
            title: title,
            date : date
        });

        newForm.save(next);

    });
}, (req, res) => {
    res.status('200').json({code: 200, success: true});
});

apiRoutes.put('/forms/editData/:id', (req, res) => {
    Forms.findByIdAndUpdate(req.params.id, {title: req.body.title}, (err, docs) => {
        if (err) {
            console.log(err);
        }
        res.status('200').json({code: 200, msg: '数据更新成功'})
    });
    // Forms.update({id: req.params.id}, {title: req.body.title}, (err, docs) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     res.status('200').json({success: true, code: 200, msg: 'update success'})
    // });
});

apiRoutes.delete('/forms/removeData/:id', (req, res) => {
    Forms.remove({_id: req.params.id}, (err, docs) => {
        if (err) {
            console.log(err);
        }
        res.status('200').json({success:true, code: 200, msg: '删除成功'})
    })

});
module.exports = apiRoutes;
