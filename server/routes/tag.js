const models = require('../models');
const express = require('express');
const router = express.Router();

// 获取全部标签
router.get('/tag', (req, res) => {
    models.Tag.findAll().then(tag => {
        res.status('200').json({success: true, data: tag});
    })
});

// 获取单个标签
router.get('/tag/:tag_id', (req, res) => {
   models.Tag.findById(req.params.tag_id).then(tag => {
       res.status('200').json({success: true, data: tag});
   })
});

// 添加标签
router.post('/user/:user_id/tag/create', (req, res) => {
    let data = req.body;
    console.log(req.params.user_id);
    models.Tag.create({
        title    : data.title,
        UserId   : req.params.user_id
    }).then(() => {
        res.status('200').json({success: true, msg: '添加成功'});
    });
});

// 更新标签
router.put('/tag/:tag_id/update', (req, res) => {
    let data = req.body;
    models.Tag.update({
        title    : data.title
    }, {
        where: {
            id: req.params.tag_id
        }
    }).then(() => {
        res.status('200').json({success: true, msg: '更新成功'});
    });
});

//删除标签
router.delete('/tag/:tag_id/destroy', (req, res) => {
    models.Tag.destroy({
        where: {
            id: req.params.tag_id
        }
    }).then(() => {
        res.status('200').json('删除成功');
    })
});


module.exports = router;
