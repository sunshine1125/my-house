const models = require('../models');
const express = require('express');
const router = express.Router();

// 获取单个评论的全部回复
router.get('/get/comment/:comment_id/reply', (req, res) => {
    models.Reply.findAll({
        where: {
            CommentId : req.params.comment_id
        },
        include: ['Comment', 'User']
    }).then(reply => {
        reply.forEach(c => {
            delete c.User.dataValues.password;
        });
        res.status('200').json({success: true, data: reply});
    })
});

// 获取单个回复
router.get('/reply/:reply_id', (req, res) => {
    models.Reply.findById(req.params.reply_id).then(reply => {
        res.status('200').json({success: true, data: reply});
    })
});

// 发表回复
router.post('/user/:user_id/comment/:comment_id/reply/create', (req, res) => {
    let data = req.body;
    models.Reply.create({
        content  : data.content,
        create_at: data.create_at,
        auth     : data.auth,
        UserId   : req.params.user_id,
        CommentId: req.params.comment_id,
    }).then(function () {
        res.status('200').json({success: true, msg: '回复成功'});
    });
});

// 更新回复
router.put('/reply/:reply_id/update', (req, res) => {
    let data = req.body;
    models.Reply.update({
        content: data.content
    }, {
        where: {
            id: req.params.reply_id
        }
    }).then(function () {
        res.status('200').json({success: true, msg: '修改成功'});
    });
});

//删除回复
router.delete('/reply/:reply_id/destroy', function (req, res) {
    models.Reply.destroy({
        where: {
            id: req.params.reply_id
        }
    }).then(() => {
        res.status('200').json('删除成功');
    });
});


module.exports = router;
