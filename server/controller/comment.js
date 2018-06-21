const express = require('express');
const apiRoutes = express.Router();
const Comments = require('../models/comment');

// get comment
apiRoutes.get('/getComments/:articleId', (req, res) => {
  Comments.find({articleId: req.params.articleId})
    .exec((err, data) => {
      if (err) {
        // console.log(err);
      }
      res.status('200').json({success: true, code: 200, data: data})
    })
});

// add comment
apiRoutes.post('/addComment', (req, res, next) => {
  let comment = new Comments({
    auth         : req.body.auth,
    authId       : req.body.authId,
    content      : req.body.content,
    date         : req.body.date,
    articleId    : req.body.articleId,
    avatar       : req.body.avatar,
    replyInfo    : []
  });
  comment.save(next);
  res.status('200').json({success: true, code: 200})
});

module.exports = apiRoutes;
