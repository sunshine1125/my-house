const models = require('../models');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const SALT_ROUNDS = 10;

// 用户注册
router.post('/register', (req, res) => {
    let data = req.body;
    let password = data.password;
    let noop = () => {};
    // 生成salt并获取hash值
    bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
        bcrypt.hash(password, salt, noop, (err, hash) => {
            // 把hash值赋值给password变量
            password = hash;
            console.log(password);
            models.User.findOne({
                where: {
                    email: data.email
                }
            }).then((result) => {
                if (!result) {
                    models.User.create({
                        username: data.username,
                        email   : data.email,
                        password: password
                    }).then(() => {
                        res.status('200').json({success: true, msg: '注册成功'});
                    })
                } else {
                    res.status('200').json({success: false, msg: '已有账号，请直接登录'});
                }
            })
        })
    });
});

// 用户登录
router.post('/auth', (req, res) => {
    let data = req.body;
    let password = data.password;
    models.User.findOne({
        where: {
            email: data.email
        }
    }).then(result => {
        if (result) {
            bcrypt.compare(password, result.dataValues.password, (err, isMatch) => {
                if (isMatch) {
                    let currentUser = {
                        id      : result.dataValues.id,
                        username: result.dataValues.username,
                        email   : result.dataValues.email,
                        phone   : result.dataValues.phone,
                        avatar  : result.dataValues.avatar
                    };
                    res.status('200').json({success: true, msg: '登录成功', user: currentUser});
                } else {
                    res.status('201').json({success: false, msg: '您输入的密码不正确'})
                }
            });
        } else {
            res.status('201').json({success: false, msg: '账号不存在'})
        }
    })
});

// 获取单个用户
router.get('/:email', (req, res) => {
    models.User.findOne({
        where: {
            email: req.params.email
        }
    }).then(user => {
        res.status('200').json({success: true, user: user});
    })
});

// 获取某个用户
router.get('/:user_id', (req, res) => {
    models.User.findById(req.params.user_id).then(user => {
        res.status('200').json({success: true, user: user});
    });
});

// 删除用户
router.delete('/:user_id', (req, res) => {
    models.User.destroy({
        where: {
            id: req.params.user_id
        }
    }).then(() => {
        res.status('200').json('注销成功');
    });
});


module.exports = router;
