const models = require('../models');
const express = require('express');
const router = express.Router();

router.post('/user/:user_id/followUser/:follow_id', (req, res) => {
    models.User_Follow.create({
        user_id   : req.params.user_id,
        follow_id : req.params.follow_id
    }).then(function (result) {
        res.status('200').json({success: true, msg: '操作成功', messageId: result.dataValues.id});
    });
});

// 获取当前用户跟随的所有人
router.get('/user/:user_id/followUser', (req, res) => {
    models.User_Follow.findAll({
        where: {
            user_id   : req.params.user_id
        },
        include: ['follow']
    }).then(function (data) {
        data.map(d => {
            delete  d.follow.dataValues.password
        })
        res.status('200').json({success: true, msg: '操作成功', data: data});
    });
});

router.delete('/user/:user_id/followUser/:follow_id', (req, res) => {
    models.User_Follow.destroy({
        where: {
            user_id   : req.params.user_id,
            follow_id : req.params.follow_id
        }
    }).then(function () {
        res.status('200').json({success: true, msg: '操作成功'});
    });
});
module.exports = router;
