const models = require('../models');
const express = require('express');
const router = express.Router();

// 获取全部文章
router.get('/post', (req, res) => {
    models.Post.findAll().then(post => {
        res.status('200').json({success: true, data: post})
    })
});

// 获取某个用户的全部文章
router.get('/user/:user_id/post', (req, res) => {
   models.Post.findAll({
       where: {
           UserId: req.params.user_id
       }
   }).then(post => {
       res.status('200').json({success: true, data: post});
   })
});

// 获取单个文章
router.get('/post/:post_id', (req, res) => {
   models.findById(req.params.post_id).then(post => {
       res.status('200').json({success: true, data: post});
   })
});

// 发表文章
router.post('/user/:user_id/post/create', (req, res) => {
    let data = req.body;
    models.Post.create({
        cover    : data.cover,
        title    : data.title,
        content  : data.content,
        create_at: data.create_at,
        UserId   : req.params.user_id,
    }).then(function () {
        res.status('200').json({success: true, msg: '添加成功'});
    });
});

// 更新文章
router.put('/post/:post_id/update', (req, res) => {
    let data = req.body;
    models.Post.update({
        cover    : data.cover,
        title    : data.title,
        content  : data.content
    }, {
        where: {
            id: req.params.post_id
        }
    }).then(function () {
        res.status('200').json({success: true, msg: '更新成功'});
    });
});

//删除文章
router.delete('/post/:post_id/destroy', function (req, res) {
    models.Post.destroy({
        where: {
            id: req.params.post_id
        }
    }).then(() => {
        res.status('200').json('删除成功');
    })
});


module.exports = router;
