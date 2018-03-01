const express = require('express');
const apiRoutes = express.Router();
const Forms = require('../models/form');

apiRoutes.get('/post/get', (req, res) => {
    Forms.find()
        .exec(function (err, data) {
            res.status('200').json(data);
        });
});

apiRoutes.post('/post/add', (req, res, next) => {
    let title = req.body.title;
    let date = req.body.date;
    Forms.findOne({title: title}, (err, data) => {
        if (err) {
            return next(err);
        }
        if (data) {
            res.status('200').json({success: false, code: 100, msg: '数据已经存在'})
        }
        let newForm = new Forms({
            title: title,
            date : date
        });

        newForm.save(next);

    });
}, (req, res) => {
    res.status('200').json({code: 200, success: true});
});

apiRoutes.put('/post/edit/:id', (req, res) => {
    Forms.findByIdAndUpdate(req.params.id, {title: req.body.title}, (err, docs) => {
        if (err) {
            console.log(err);
        }
        res.status('200').json({code: 200, msg: '数据更新成功'})
    });
});

apiRoutes.delete('/post/remove/:id', (req, res) => {
    Forms.remove({_id: req.params.id}, (err, docs) => {
        if (err) {
            console.log(err);
        }
        res.status('200').json({success:true, code: 200, msg: '删除成功'})
    })

});


module.exports = apiRoutes;
