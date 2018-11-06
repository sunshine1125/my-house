const models = require('../models');
const express = require('express');
const router = express.Router();
const md = require('markdown-it')();

// 获取用户赞过的文章
router.get('/user/:user_id/post_like', (req, res) => {
    models.P_like.findAll({
        where: {
            UserId: req.params.user_id
        },
        include: ['Post']
    }).then(function (data) {
        data.forEach(item => {
            item.Post.content = md.render(item.Post.content);
        });
        res.status('200').json({success: true, msg: '操作成功', data: data});
    });
});

// 点赞
router.post('/user/:user_id/post/:post_id/like', (req, res) => {
    models.P_like.create({
        UserId: req.params.user_id,
        PostId: req.params.post_id
    }).then(function (result) {
        res.status('200').json({success: true, msg: '操作成功', messageId: result.dataValues.id});
    });
});

// 取消点赞
router.delete('/user/:user_id/post/:post_id/like', (req, res) => {
    models.P_like.destroy({
        where: {
            UserId: req.params.user_id,
            PostId: req.params.post_id
        }
    }).then(function () {
        res.status('200').json({success: true, msg: '操作成功'});
    });
});

module.exports = router;
