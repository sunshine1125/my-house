const Users = require('./user');
const Forms = require('./form');
const express = require('express');
const router = express.Router();

router.get('/login/getAccount', (req, res)=> {
  Forms.find()
    .exec((err, users)=> {
      res.status('200').json(users);
    })
});

router.post('/login/createAccount', (req, res)=> {
  let newUser = new Users({
    username: req.body.username,
    password: req.body.password
  });
  newUser.save((err, data)=> {
    if (err) {
      res.status('405').json({code: 405, msg: err})
    } else {
      res.status('200').json({code: 0, msg: 'login success'})
    }
  });
});

router.get('/forms/getData', (req, res)=> {
  Forms.find()
    .exec(function (err, users) {
      res.status('200').json(users);
    });
});

router.post('/forms/addData', (req, res, next)=> {
  let id = req.body.id;
  let title = req.body.title;
  let date = req.body.date;
  Forms.findOne({id: id}, (err, user)=> {
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
}, (req, res)=> {
  res.status('200').json({code: 0, msg: 'success'})
});

router.put('/forms/editData/:id', (req, res)=> {
  console.log(req.params.id);
  console.log(req.body.title);
  Forms.update({id: req.params.id}, {title: req.body.title}, (err, docs)=> {
    if (err) {
      console.log(err);
    }
    res.status('200').json({code: 2000, msg: 'update success' + docs})
  });
});

router.delete('/forms/removeData/:id', (req, res) => {
  // id 用户
  Forms.remove({id: req.params.id}, (err, docs) => {
    if (err) {
      console.log(err);
    }
    res.status('200').json({code: 1000, msg: 'delete success' + docs})
  })

});

module.exports = router;
