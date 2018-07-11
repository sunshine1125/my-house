const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const SALT_ROUNDS = 10;
const express = require('express');
const app = express();
const request = require('request');
const qs = require('querystring');
const apiRoutes = express.Router();
const User = require('../models/frontUser');
const Like = require('../models/like');

let config = process.env.NODE_ENV === 'development' ? require('../config/dev') : require('../config/prod');

app.set('superSecret', config.MongoDB.secret);// secret variable

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

apiRoutes.get('/authGitHub', (req, res) => {
  let auth_url = `${config.github.auth_url}?client_id=${config.github.client_Id}&redirect_uri=${config.github.redirect_uri}`;
  res.status(200).json({success: true, auth_url: auth_url});
});

apiRoutes.get('/github/oauth', (req, res) => {
  getGitHubUserInfo(req.query.code).then(userInfo => {
    let user = {
      name   : userInfo.login,
      avatar : userInfo.avatar_url,
      user_id: userInfo.id
    };
    console.log(user);
    res.status(200).json({success: true, user: user});
  });
});


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
        username: req.body.username,
        password: password,// 把加密后的密码存入数据库
        phone   : req.body.phone,
        roleId  : 3,
        avatar  : '//my-house.pek3b.qingstor.com/default.jpg',
        admin   : true,
        post    : []
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
              const payload = {
                admin: true
              };
              let token = jwt.sign(payload, app.get('superSecret'))
              return res.json({
                success: true,
                message: '添加成功',
                data   : {
                  _id     : data._id,
                  username: data.username,
                  token   : token,
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
apiRoutes.get('/getUserById/:id', (req, res) => {
  User.findOne({_id: req.params.id}, (err, user) => {
    res.status('200').json({success: true, data: user})
  })
});

// update user info
apiRoutes.put('/updateUserInfo/:id', (req, res) => {
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

apiRoutes.post('/like/active', (req, res) => {
  let like = new Like({
    articleId: req.body.articleId,
    active   : req.body.active,
    user     : req.body.user
  })
  like.save();
  res.status('200').json({success: true, code: 200})
})

apiRoutes.delete('/like/:articleId/active', (req, res) => {
  console.log(req.params.articleId)
  Like.findOneAndRemove({articleId: req.params.articleId}, (err, data) => {
    res.status('200').json({success: true, code: 200})
  })
})

apiRoutes.get('/like/active/:personId', (req, res) => {
  Like.find({user: req.params.personId})
    .exec((err, data) => {
      if (err) {
      }
      res.status('200').json({success: true, code: 200, data: data})
    })
})

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
          const payload = {
            admin: user.admin
          };
          let token = jwt.sign(payload, app.get('superSecret'))
          return res.json({
            success: true,
            message: '登录成功',
            _id    : user._id,
            token  : token,
            roleId : 3
          })
        }
      })
    }
  })
});

module.exports = apiRoutes;
