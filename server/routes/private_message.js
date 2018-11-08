const models = require('../models');
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getMessage = (send_id, rec_id) => {
    return models.P_message.findAll({
        where  : {
            [Op.or]: [{send_id: send_id, rec_id : rec_id}, {send_id: rec_id, rec_id : send_id}]
        },
        include: ['send']
    })
};
// 获取私信
router.get('/send/:send_id/rec/:rec_id', (req, res) => {
    getMessage(req.params.send_id, req.params.rec_id).then(msg => {
        msg.forEach(m => {
            delete m.send.dataValues.password;
        });
        res.status('200').json({success: true, data: msg});
    })
});

// 发表私信
router.post('/send/:send_id/rec/:rec_id', (req, res) => {
    let data = req.body;
    models.P_message.create({
        content: data.content,
        floor  : data.floor,
        rec_id : req.params.rec_id,
        send_id: req.params.send_id
    }).then(function (result) {
        getMessage(req.params.send_id, req.params.rec_id).then(msg => {
            msg.forEach(m => {
                delete m.send.dataValues.password;
            });
            res.status('200').json({success: true, msg: '发表成功', messageId: result.dataValues.id, data: msg})
        })
    });
});

// //删除评论
// router.delete('/comment/:comment_id/destroy', (req, res) => {
//     models.Comment.destroy({
//         where: {
//             id: req.params.comment_id
//         }
//     }).then(() => {
//         res.status('200').json('删除成功');
//     })
// });

module.exports = router;
