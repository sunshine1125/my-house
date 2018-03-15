const express = require('express');
const apiRoutes = express.Router();
const Tags = require('../models/tag');

// get
apiRoutes.get('/getTag', (req, res) => {
    Tags.find()
        .exec((err, data) => {
            if (err) {
                console.log(err);
            }
            res.status('200').json({success: true, code:200, data: data})
        })
});

// add
apiRoutes.post('/addTag', (req, res, next) => {
    let title = req.body.title;
    let tag = new Tags({
        title: title
    });
    tag.save(next);
}, (req, res) => {
    Tags.find()
        .exec((err, data) => {
            if (err) {
                console.log(err);
            }
            res.status('200').json({success: true, code:200, data: data})
        })
});

// edit
apiRoutes.put('/editTag/:id', (req, res) => {
    Tags.findByIdAndUpdate(req.params.id, {title: req.body.title}, (err, docs) => {
        if (err) {
            console.log(err);
        }
        res.status('200').json({success: true, code: 200})
    });
});

// remove
apiRoutes.delete('/removeTag/:id', (req, res) => {
    Tags.findByIdAndRemove(req.params.id, (err, docs) => {
        if (err) {
            console.log(err);
        }
        res.status('200').json({success: true, code: 200})
    });
});

module.exports = apiRoutes;
