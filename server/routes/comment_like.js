const models = require('../models');
const express = require('express');
const router = express.Router();

router.get('/user/:user_id/comment_like', (req, res) => {
    models.C_like.findAll({
        where: {
            user_id: req.params.user_id
        }
    }).then(function (data) {
        res.status('200').json({success: true, msg: '操作成功', data: data});
    });
});

// 点赞
router.post('/user/:user_id/comment/:comment_id/like', (req, res) => {
    models.C_like.create({
        user_id   : req.params.user_id,
        comment_id: req.params.comment_id
    }).then(function () {
        res.status('200').json({success: true, msg: '操作成功'});
    });
});

// 取消点赞
router.delete('/user/:user_id/comment/:comment_id/like', (req, res) => {
    models.C_like.destroy({
        where: {
            user_id   : req.params.user_id,
            comment_id: req.params.comment_id
        }
    }).then(function () {
        res.status('200').json({success: true, msg: '操作成功'});
    });
});

module.exports = router;
