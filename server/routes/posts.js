const models = require('../models');
const express = require('express');
const router = express.Router();
const md = require('markdown-it')();

// 获取全部文章
router.get('/post', (req, res) => {
    models.Post.findAll({
        offset : parseInt(req.query.skip),
        limit  : parseInt(req.query.limit),
        include: ['Tag', 'User']
    }).then(post => {
        post.forEach(item => {
            item.content = md.render(item.content);
            delete item.User.dataValues.password;
        });
        res.status('200').json({success: true, data: post})
    })
});

// 获取某个用户的全部文章
router.get('/user/:user_id/post', (req, res) => {
   models.Post.findAll({
       where: {
           UserId: req.params.user_id
       },
       include: ['Tag']
   }).then(post => {
       post.forEach(item => {
           item.content = md.render(item.content);
       });
       res.status('200').json({success: true, data: post});
   })
});

// 获取某个标签下的全部文章
router.get('/tag/:tag_id/post', (req, res) => {
    models.Post.findAll({
        where: {
            TagId: req.params.tag_id
        },
        offset : parseInt(req.query.skip),
        limit  : parseInt(req.query.limit),
        include: ['User']
    }).then(post => {
        if (post) {
            post.forEach(item => {
                item.content = md.render(item.content);
                delete item.User.dataValues.password;
            });
        }
        res.status('200').json({success: true, data: post});
    })
});

// 获取单个文章
router.get('/post/:post_id/:edit?', (req, res) => {
   models.Post.findOne({
       where: {
           id: req.params.post_id
       },
       include: ['Tag', 'User']
   }).then(post => {
       if (post) {
           if (! req.params.edit) {
               post.content = md.render(post.content);
           }
           delete post.User.dataValues.password;
           res.status('200').json({success: true, data: post});
       } else {
           res.status('202').json({success: false, notFound: true});
       }
   })
});

// 获取文章标题
router.get('/post/:post_id/msg', (req, res) => {
    models.Post.findOne({
        where: {
            id: req.params.post_id
        },
    }).then(post => {
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
        TagId    : data.TagId
    }).then(function (result) {
        res.status('200').json({success: true, msg: '添加成功', messageId: result.dataValues.id});
    });
});

// 更新文章
router.put('/post/:post_id/update', (req, res) => {
    let data = req.body;
    models.Post.update({
        cover    : data.cover,
        title    : data.title,
        content  : data.content,
        TagId    : data.TagId
    }, {
        where: {
            id: req.params.post_id
        }
    }).then(() => {
        res.status('200').json({success: true, msg: '更新成功'});
    });
});

// 点赞
router.put('/post/:post_id/like', (req, res) => {
    models.Post.update({
        like_num : req.body.like_num
    }, {
        where: {
            id: req.params.post_id
        }
    }).then(function () {
        res.status('200').json({success: true, msg: '操作成功'});
    });
});

//删除文章
router.delete('/post/:post_id/destroy', (req, res) => {
    models.Post.destroy({
        where: {
            id: req.params.post_id
        }
    }).then(() => {
        res.status('200').json('删除成功');
    })
});

// 评论数
router.put('/post/:post_id/comment', (req, res) => {
    models.Post.update({
        comment_num: req.body.comment_num
    },{
        where: {
            id: req.params.post_id
        }
    }).then(function () {
        res.status('200').json({success: true, msg: '操作成功'});
    });
});

module.exports = router;
