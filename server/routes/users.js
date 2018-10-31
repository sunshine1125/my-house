const models = require('../models');
const express = require('express');
const router = express.Router();
const request = require('request');
const qs = require('querystring');
const bcrypt = require('bcrypt-nodejs');
const SALT_ROUNDS = 10;
const sendEmail = require('../tools/sendEmail');

const config = process.env.NODE_ENV === 'development' ? require('../config/dev') : require('../config/prod');

const apiPort = config.http.apiPort;
const sender = config.email.user;
// 邮箱验证
router.post('/sendMail', (req, res) => {
    let options = {
        from   : '"测试"' + sender,
        to     : '"测试"' + req.body.email,
        subject: '一封来自sunshine1125的邮件',
        text   : '一封来自sunshine1125的邮件',
        html   : `<h1>修改密码</h1>
                  <p>确认修改密码吗？</p>
                  <a href="${apiPort}/user/checkEmail/?email=${req.body.email}">修改密码</a>`
    };
    sendEmail(options, res);
});

router.get('/checkEmail', (req, res) => {
    models.User.update({changePassword: 1}, {
        where: {
            email: req.query.email
        }
    }).then(() => {
        let url = `${config.http.password}/?checkEmail=${req.query.email}`;
        res.redirect(url)
    })
});

const getGitHubUserInfo = code => {
    return new Promise((resolve, reject) => {
        request.get({
            url: `${config.github.token_url}?client_id=${config.github.client_Id}&client_secret=${config.github.client_Secret}&code=${code}`
        }, (err, res, body) => {
            token = qs.parse(body).access_token;
            resolve(token);
        })
    }).then(token => {
        return new Promise((resolve, reject) => {
            request.get({
                url    : `${config.github.getUser}?access_token=${token}`,
                headers: {
                    'User-Agent': 'Awesome-Octocat-App'
                }
            }, (err, res, body) => {
                resolve(JSON.parse(body));
            })
        })
    })
};
// 用github登录
router.get('/authGitHub', (req, res) => {
    let auth_url = `${config.github.auth_url}?client_id=${config.github.client_Id}&redirect_uri=${config.github.redirect_uri}`;
    res.status(200).json({success: true, auth_url: auth_url});
});

const getUserByGitHubId = (id, res, userInfo) => {
    models.User.findOne({
        where: {
            gitHubId: id
        }
    }).then(user => {
        if (user) {
            let currentUser = currentUserInfo(user);
            res.status('200').json({success: true, user: currentUser, hasUser: true})
        } else {
            let user = {
                username: userInfo.login,
                avatar  : userInfo.avatar_url,
                email   : userInfo.email,
                gitHubId: userInfo.id
            };
            models.User.create(user).then(() => {
                res.status(200).json({success: true, user: userInfo, hasUser: false});
            })
        }
    })
};

const matchPassword = (req) => {
    let data = req.body;
    let password = data.password;
    return new Promise((resolve, reject) => {
        models.User.findOne({
            where: {
                email: data.email
            }
        }).then(result => {
            if (result) {
                bcrypt.compare(password, result.dataValues.password, (err, isMatch) => {
                    resolve(isMatch);
                })
            }
        })
    })

};

router.get('/github/oauth', (req, res) => {
    getGitHubUserInfo(req.query.code).then(userInfo => {
        if (!userInfo.message) {
            getUserByGitHubId(userInfo.id, res, userInfo);
        } else {
            res.status(500).json({success: true, msg: userInfo.message});
        }
    });
});

router.get('/github/:gitHubId', (req, res) => {
    models.User.findOne({
        where: {
            gitHubId: req.params.gitHubId
        }
    }).then(user => {
        res.status('200').json({success: true, user: user});
    })
});

// 用户注册
router.post('/register', (req, res) => {
    let data = req.body;
    let password = data.password;
    let phone = data.phone ? data.phone : '';
    let admin = data.admin ? data.admin : false;
    let noop = () => {
    };
    // 生成salt并获取hash值
    bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
        bcrypt.hash(password, salt, noop, (err, hash) => {
            // 把hash值赋值给password变量
            password = hash;
            models.User.findOne({
                where: {
                    email: data.email
                }
            }).then((result) => {
                if (!result) {
                    models.User.create({
                        username: data.username,
                        email   : data.email,
                        password: password,
                        phone   : phone,
                        admin   : admin
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

const currentUserInfo = result => {
    return {
        id            : result.dataValues.id,
        username      : result.dataValues.username,
        email         : result.dataValues.email,
        phone         : result.dataValues.phone,
        avatar        : result.dataValues.avatar,
        admin         : result.dataValues.admin,
        gitHubId      : result.dataValues.gitHubId,
        changePassword: result.dataValues.changePassword
    }
};

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
                    let currentUser = currentUserInfo(result);
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
        let currentUser = currentUserInfo(user);
        delete user.dataValues.password;
        res.status('200').json({success: true, user: currentUser});
    })
});

// 获取全部用户
router.get('/', (req, res) => {
    models.User.findAll().then(user => {
        user.map(u => {
            delete u.dataValues.password;
        });
        res.status('200').json({success: true, user: user});
    });
});

// 获取某个用户
router.get('/get/:user_id', (req, res) => {
    models.User.findOne({
        where: {
            id : req.params.user_id
        }
    }).then(user => {
        delete user.dataValues.password;
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

//修改用户信息
router.put('/:user_id', (req, res) => {
    let data = req.body;
    let updateUser = {
        username: data.username,
        phone   : data.phone,
        avatar  : data.avatar
    };
    if (data.password) {
        let noop = () => {
        };
        // 生成salt并获取hash值
        bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
            bcrypt.hash(data.password, salt, noop, (err, hash) => {
                updateUser.password = hash;
            })
        });
    }
    if (data.admin) {
        updateUser.admin = data.admin;
    }

    models.User.update(updateUser, {
        where: {
            id: req.params.user_id
        }
    }).then(() => {
        res.status('200').json({success: true, msg: '更新成功'});
    })
});

router.put('/:user_id?/password/:type', (req, res) => {
    if (req.params.type === 'reset') {
        matchPassword(req).then(isMatch => {
            if (isMatch) {
                updatePass(req, res, {
                    id: req.params.user_id
                });
            } else {
                res.status('202').json({success: false, msg: '您输入的旧密码不正确'})
            }
        })
    } else {
        updatePass(req, res, {
            email: req.body.email
        });
    }
});

const updatePass = (req, res, query) => {
    let data = req.body;
    let newPass = data.newPass;
    let noop = () => {
    };
    // 生成salt并获取hash值
    bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
        bcrypt.hash(newPass, salt, noop, (err, hash) => {
            // 把hash值赋值给password变量
            newPass = hash;
            models.User.update({
                password: newPass
            }, {
                where: query
            }).then(() => {
                res.status('200').json({success: true, msg: '更新成功'});
            })
        })
    })
}

module.exports = router;
