const express = require('express');
const apiRoutes = express.Router();
const Posts = require('../models/post');


apiRoutes.get('/post/get/:id', (req, res) => {
    let userId = req.params.id;
    let matchData = [];
    Posts.find()
        .populate({path: 'uid'})
        .exec((err, data) => {
            data.forEach( item => {
                if(item.uid._id == userId) {
                    matchData.push(item);
                }
            });
            res.status('200').json(matchData);
        });
});

apiRoutes.post('/post/add/:id', (req, res, next) => {
    let userId = req.params.id;
    let title = req.body.title;
    let date = req.body.date;
    Posts.findOne({title: title}, (err, data) => {
        if (err) {
            return next(err);
        }
        if (data) {
            res.status('200').json({success: false, code: 100, msg: '数据已经存在'})
        }
        let newForm = new Posts({
            title: title,
            date : date,
            uid  : userId
        });
        newForm.save(next);
        // User.findOne({_id: userId}, (err, data) => {
        //     if (data) {
        //
        //     }
        // })

    });
}, (req, res) => {
    res.status('200').json({code: 200, success: true});
});

apiRoutes.put('/post/edit/:id', (req, res) => {
    Posts.findByIdAndUpdate(req.params.id, {title: req.body.title}, (err, docs) => {
        if (err) {
            console.log(err);
        }
        res.status('200').json({code: 200, msg: '数据更新成功'})
    });
});

apiRoutes.delete('/post/remove/:id', (req, res) => {
    Posts.remove({_id: req.params.id}, (err, docs) => {
        if (err) {
            console.log(err);
        }
        res.status('200').json({success: true, code: 200, msg: '删除成功'})
    })

});


module.exports = apiRoutes;
