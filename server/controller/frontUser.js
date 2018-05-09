const bcrypt = require('bcrypt-nodejs');
const SALT_ROUNDS = 10;
const express = require('express');
const app = express();
const apiRoutes = express.Router();
const User = require('../models/frontUser');

let config = process.env.NODE_ENV === 'development' ? require('../config/dev') : require('../config/prod');

app.set('superSecret', config.MongoDB.secret);// secret variable

// user register
apiRoutes.post('/userRegister', (req, res) => {
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
        phone             : req.body.phone,
        roleId            : 3
      });
      User.findOne({
        phone: req.body.phone
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
                data   : {
                  _id     : data._id,
                  username: data.username,
                  roleId  : data.roleId

                }
              })
            }
          })
        }
      });
    })
  });

});

// get single user
apiRoutes.get('/getUserById/:id', (req,res) => {
  User.findOne({_id: req.params.id}, (err, user) => {
    res.status('200').json({success: true, data: user.username})
  })
})

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
            token  : token
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
})

module.exports = apiRoutes;
