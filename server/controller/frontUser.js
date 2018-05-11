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
        roleId            : 3,
        avatar            : req.body.avatar
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
    res.status('200').json({success: true, data: user})
  })
});

apiRoutes.post('/login', (req, res) => {
  let password = req.body.password;
  User.findOne({
    phone: req.body.phone
  }, function (err, user) {
    if (err) throw err;
    if (!user) {
      res.json({success: false, message: '验证失败，没有找到用户！'})
    } else if (user) {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (!isMatch) {
          res.json({success: false, message: '密码输入错误'})
        } else {
          return res.json({
            success: true,
            message: '登录成功',
            _id    : user._id
          })
        }
      })
    }
  })
});

module.exports = apiRoutes;
