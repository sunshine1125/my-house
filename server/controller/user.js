const express = require('express');
const apiRoutes = express.Router();
const bcrypt = require('bcrypt-nodejs');
const SALT_ROUNDS = 10;
const user = require('../models/user2');

// register
apiRoutes.post('/register', (req, res) => {
    let data = req.body;
    let password = data.password;
    let noop = function () {
    };
    // 生成salt并获取hash值
    bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
        bcrypt.hash(password, salt, noop, (err, hash) => {
            // 把hash值赋值给password变量
            password = hash;

            user.findByEmail(data.email).then((result) => {
                if (!result) {
                    user.addUser(data.username, data.email, password).then(() => {
                        res.status('200').json({success: true, msg: '注册成功'});
                    })
                } else {
                    res.status('200').json({success: false, msg: '已有账号，请直接登录'});
                }
            })
        })
    })
});
// login
apiRoutes.post('/authentication', (req, res) => {
    let data = req.body;
    let password = data.password;
    user.findByEmail(data.email).then(result => {
        if (result) {
            bcrypt.compare(password, result.dataValues.password, (err, isMatch) => {
                if (isMatch) {
                    let currentUser = {
                        userId  : result.dataValues.userId,
                        userName: result.dataValues.userName,
                        email   : result.dataValues.email,
                        phone   : result.dataValues.phone,
                        avatar  : result.dataValues.avatar
                    };
                    res.status('200').json({success: true, msg: '登录成功', currentUserInfo: currentUser});
                } else {
                    res.status('201').json({success: false, msg: '您输入的密码不正确'})
                }
            });
        } else {
            res.status('201').json({success: false, msg: '账号不存在'})
        }
    })
});

apiRoutes.get('/getUser/:email', (req, res) => {
    user.findByEmail(req.params.email).then(response => {
        let currentUser = {
            userId  : response.dataValues.userId,
            userName: response.dataValues.userName,
            email   : response.dataValues.email,
            phone   : response.dataValues.phone,
            avatar  : response.dataValues.avatar
        };
        res.status('200').json({success: true, currentUserInfo: currentUser});
    });
});

module.exports = apiRoutes;
