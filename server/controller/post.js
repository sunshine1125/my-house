const express = require('express');
const apiRoutes = express.Router();
// 引入Multiparty解析表单
const multipary = require('multiparty');
const multer = require('multer');
const Posts = require('../models/post');
const md = require('markdown-it')();

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
});
const upload = multer({storage: storage});
apiRoutes.post('/post/uploadImage', upload.single('file'), (req, res) => {
    let url = '/api/uploads/' + req.file.filename;
    res.json({success: true, path: url});
});

// get user's post
apiRoutes.get('/post/get/:id', (req, res) => {
    let userId = req.params.id;
    let matchData = [];
    Posts.find()
        .populate({path: 'uid'})
        .exec((err, data) => {
            data.forEach(item => {
                if (item.uid._id == userId) {
                    matchData.push(item);
                }
            });
            res.status('200').json(matchData);
        });
});

// get Detail post
apiRoutes.get('/post/getDetailPost/:id', (req, res) => {
    let postId = req.params.id;
    Posts.findOne({_id: postId})
        .exec((err, post) => {
            post.content = md.render(post.content);
            res.status('200').json(post);
        });
});

// get Single post
apiRoutes.get('/post/getSinglePost/:id', (req, res) => {
    let postId = req.params.id;
    Posts.findOne({_id: postId})
        .exec((err, post) => {
            res.status('200').json(post);
        });
});

apiRoutes.post('/post/add/:id', (req, res, next) => {
    let userId = req.params.id;
    let title = req.body.title;
    let date = req.body.date;
    let image = req.body.image;
    let content = req.body.content;
    Posts.findOne({title: title}, (err, data) => {
        if (err) {
            return next(err);
        }
        if (data) {
            res.status('200').json({success: false, code: 100, msg: '数据已经存在'})
        }
        let newForm = new Posts({
            image  : image,
            title  : title,
            content: content,
            date   : date,
            uid    : userId
        });
        newForm.save(next);

    });
}, (req, res) => {
    res.status('200').json({code: 200, success: true});
});

apiRoutes.put('/post/edit/:id', (req, res) => {
    Posts.findByIdAndUpdate(req.params.id, {title: req.body.title, content: req.body.content, image: req.body.image}, (err, docs) => {
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
