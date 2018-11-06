const models = require('../models');
const express = require('express');
const router = express.Router();

// 获取同一个接收者的全部消息
router.get('/user/:user_id/msg', (req, res) => {
    models.Message.findAll({
        where  : {
            rec_id: req.params.user_id,
            status: false
        },
    }).then(msg => {
        res.status('200').json({success: true, data: msg});
    })
});

const getTypeTitle = async(id) => {
    return await models.Post.findById(id);
};

const getCommentTitle = async(id) => {
    return await models.Comment.findById(id);
};

// 获取单个类型的消息
router.get('/user/:user_id/message/:type', async(req, res) => {
    let msg = await models.Message.findAll({
        where  : {
            rec_id: req.params.user_id,
            type  : req.params.type
        },
        include: ['send', 'comment', 'c_like', 'post', 'like', 'follow', 'p_post']
    });
    for (let m of msg) {
        console.log(m);
        delete m.send.dataValues.password;
        if (req.params.type === 'comment' || req.params.type === 'like') {
            let title = '';
            if (m.c_like) {
                title = await getCommentTitle(m.c_like.comment_id);
            } else {
                title =  await getTypeTitle(m[req.params.type].PostId);
            }
            m.dataValues.type_title = title.dataValues.title || title.dataValues.content;
            if (m.c_like) m.dataValues.post_id = title.dataValues.PostId;
        } else if (req.params.type === 'post') {
            if (m.p_post) {
                title  = await getTypeTitle(m.p_post.PostId);
                m.dataValues.type_title = title.dataValues.title;
            }
        }
    }
    res.status('200').json({success: true, data: msg});
});

// 新增
router.post('/send/:send_id/rec/:rec_id/message/:message_id/:type/:d?', (req, res) => {
    let newData = {
        send_id   : req.params.send_id,
        rec_id    : req.params.rec_id,
        type      : req.params.type
    }
    let msg_type = '';
    if (req.params.d) {
        msg_type = `${req.params.d}_${req.params.type}_id`;
    } else {
        msg_type = `${req.params.type}_id`;
    }
    newData[msg_type] = req.params.message_id;
    models.Message.create(newData).then(function () {
        res.status('200').json({success: true, msg: '添加成功'});
    });
});

// 更新单个类型的消息状态
router.put('/user/:user_id/:type', (req, res) => {
    models.Message.update({
        status: true
    },{
        where  : {
            rec_id: req.params.user_id,
            type  : req.params.type
        }
    }).then(msg => {
        res.status('200').json({success: true});
    })
});

module.exports = router;
