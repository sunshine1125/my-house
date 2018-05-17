const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const SALT_ROUNDS = 10;
const express = require('express');
const app = express();
const apiRoutes = express.Router();
const User = require('../models/user');
const confirToken = require('../tools/confirToken');
const sendEmail = require('../tools/sendMail');

let config = process.env.NODE_ENV === 'development' ? require('../config/dev') : require('../config/prod');

app.set('superSecret', config.MongoDB.secret);// secret variable

// user register
apiRoutes.post('/register', (req, res) => {
  let password = req.body.password;
  let noop = function () {
  };
  // 生成salt并获取hash值
  bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
    bcrypt.hash(password, salt, noop, (err, hash) => {
      // 把hash值赋值给password变量
      password = hash;

      let newUser = new User({
        username          : req.body.username,
        password          : password,// 把加密后的密码存入数据库
        email             : req.body.email,
        userTypeId        : req.body.userTypeId,
        userType          : '',
        phone             : null,
        roleId            : 1,
        avatar            : req.body.avatar,
        confirmation_token: confirToken,
        changePassword    : false,
        admin             : true,
      });
      User.findOne({
        email: req.body.email
      }, function (err, user) {
        if (user) {
          res.json({success: false, message: '该用户已经存在！'})
        } else {

          newUser.save((err, data) => {
            if (err) {
              res.status('405').json({code: 405, msg: err})
            } else {
              return res.json({
                success: true,
                message: '添加成功',
              })
            }
          })
        }
      });
    })
  });

});

const apiPort = config.http.apiPort;
const sender = config.email.user;
apiRoutes.post('/sendEmail', (req, res) => {
  let options = {
    from   : '"测试"' + sender,
    to     : '"测试"' + req.body.email,
    subject: '一封来自sunshine1125的邮件',
    text   : '一封来自sunshine1125的邮件',
    html   : `<h1>你好，欢迎加入我们！</h1>
                  <p>请点击下面的按钮激活你的账户</p> 
                  <a href= "${apiPort}/checkActive/?email=${req.body.email}">点击激活账号</a>`
  };
  sendEmail(options, res);
});

apiRoutes.post('/forgotPassword', (req, res) => {
  let options = {
    from   : '"测试"' + sender,
    to     : '"测试"' + req.body.email,
    subject: '一封来自sunshine1125的邮件',
    text   : '一封来自sunshine1125的邮件',
    html   : `<h1>修改密码</h1>
                  <p>确认修改密码吗？</p>
                  <a href="${apiPort}/checkPassword/?email=${req.body.email}">修改密码</a>`
  };

  sendEmail(options, res);
});

apiRoutes.get('/checkActive', (req, res) => {
  User.update({email: req.query.email}, {confirmation_token: null}, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect(config.url.login)
    }
  })
});

apiRoutes.get('/checkPassword', (req, res) => {
  User.update({email: req.query.email}, {changePassword: true}, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect(config.url.changePassword)
    }
  })
});

apiRoutes.post('/singleUser', (req, res) => {
  if (req.body.oldPassword) {
    User.findOne({email: req.body.email}, (err, user) => {
      let oldPassword = req.body.oldPassword;
      bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
        if (!isMatch) {
          res.json({code: 401, success: false, message: '旧密码输入错误'})
        } else {
          let password = req.body.password;
          let noop = function () {
          };
          // 生成salt并获取hash值
          bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
            bcrypt.hash(password, salt, noop, (err, hash) => {
              // 把hash值赋值给password变量
              password = hash;
              User.update({email: req.body.email}, {password: password}, (err, docs) => {
                if (err) {
                  // console.log(err);
                }
                res.status('200').json({code: 200, success: true, message: '密码修改成功'})
              });
            })
          })
        }
      })
    })
  } else {
    let password = req.body.password;
    let noop = function () {
    };
    // 生成salt并获取hash值
    bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
      bcrypt.hash(password, salt, noop, (err, hash) => {
        // 把hash值赋值给password变量
        password = hash;
        User.update({email: req.body.email}, {password: password}, (err, docs) => {
          if (err) {
            // console.log(err);
          }
          res.status('200').json({code: 200, success: true, message: '密码修改成功'})
        });
      })
    })
  }
});

apiRoutes.get('/getSingleUser/:email', (req, res) => {
  User.findOne({
    email: req.params.email
  }, (err, user) => {
    if (user) {
      res.json({success: true, username: user.username});
    }
  })
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
  let password = req.body.password;
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) throw err;
    if (!user) {
      res.json({success: false, check: true, message: '验证失败，没有找到用户！'})
    } else if (user) {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (!isMatch) {
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
            _id    : user._id,
            token  : token,
            roleId : user.roleId
          })
        }
      })
    }
  })
});

apiRoutes.get('/getAllUsers', (req, res) => {
  User.find()
    .exec((err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json({success: true, data: data})
      }

    })
});

apiRoutes.get('/getSingleUserById/:id', (req, res) => {
  User.findOne({_id: req.params.id})
    .exec((err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json({success: true, data: data})
      }

    })
});

apiRoutes.put('/updateAdminUserInfo/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, {
    username: req.body.username,
    phone   : req.body.phone,
    avatar  : req.body.avatar
  }, (err, docs) => {
    if (err) {
    }
    res.status('200').json({success: true, code: 200, msg: '信息更新成功'})
  })
})

module.exports = apiRoutes;
