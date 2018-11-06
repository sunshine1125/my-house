const models = require('../models');
const express = require('express');
const router = express.Router();

// 获取单个文章的全部评论
router.get('/get/post/:post_id/comment', (req, res) => {
    models.Comment.findAll({
        where: {
            PostId : req.params.post_id
        },
        include: [
            { model: models.User },
            { model: models.Reply }
        ]
    }).then(comment => {
        comment.forEach(c => {
            delete c.User.dataValues.password;
        });
        res.status('200').json({success: true, data: comment});
    })
});

// 获取单个评论
router.get('/comment/:comment_id', (req, res) => {
    models.Comment.findOne({
        where: {id: req.params.comment_id},
        include: [
            { model: models.User },
            { model: models.Reply }
        ]
    }).then(comment => {
        res.status('200').json({success: true, data: comment});
    })
});

// 发表评论
router.post('/user/:user_id/post/:post_id/comment/create', (req, res) => {
    let data = req.body;
    models.Comment.create({
        content  : data.content,
        create_at: data.create_at,
        floor    : data.floor,
        UserId   : req.params.user_id,
        PostId   : req.params.post_id,
    }).then(function (result) {
        res.status('200').json({success: true, msg: '发表成功', messageId: result.dataValues.id});
    });
});

// 更新评论
router.put('/comment/:comment_id/update', (req, res) => {
    let data = req.body;
    models.Comment.update({
        content: data.content
    }, {
        where: {
            id: req.params.comment_id
        }
    }).then(function () {
        res.status('200').json({success: true, msg: '修改成功'});
    });
});

//删除评论
router.delete('/comment/:comment_id/destroy',  (req, res)=> {
    models.Comment.destroy({
        where: {
            id: req.params.comment_id
        }
    }).then(() => {
        res.status('200').json('删除成功');
    })
});


// 点赞
router.put('/comment/:comment_id/like', (req, res) => {
    models.Comment.update({
        like_num : req.body.like_num
    }, {
        where: {
            id: req.params.comment_id
        }
    }).then(function () {
        res.status('200').json({success: true, msg: '操作成功'});
    });
});

module.exports = router;
