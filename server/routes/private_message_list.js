const models = require('../models');
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// 获取私信列表
router.get('/user/:user_id/msg/list', (req, res) => {
    models.P_msg_list.findAll({
        where: {
            [Op.or]: [{send_id: req.params.user_id}, {rec_id : req.params.user_id}]
        }
    }).then(data => {
        res.status('200').json({success: true, data: data});
    })
});

// 添加私信列表
router.post('/send/:send_id/rec/:rec_id/list', (req, res) => {
    let data = req.body;
    models.P_msg_list.create({
        content: data.content,
        floor  : data.floor,
        rec_id : req.params.rec_id,
        send_id: req.params.send_id
    }).then(function (result) {
        res.status('200').json({success: true, msg: '发表成功', messageId: result.dataValues.id})
    });
});

module.exports = router;
