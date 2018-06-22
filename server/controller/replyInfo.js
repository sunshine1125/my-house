const express = require('express');
const apiRoutes = express.Router();
const replyInfos = require('../models/replyInfo');
const Comments = require('../models/comment');

apiRoutes.get('/getComments/comment/:commentId', (req, res) => {
  Comments.find({_id: req.params.commentId})
    .exec((err, data) => {
      if (err) {
        // console.log(err);
      }
      console.log(data);
      res.status('200').json({success: true, code: 200, data: data})
    })
});

// get comment
apiRoutes.get('/getReplyComments/comment/:commentId', (req, res) => {
  replyInfos.find({commentId: req.params.commentId})
    .exec((err, data) => {
      if (err) {
        console.log(err);
      }
      res.status('200').json({success: true, code: 200, data: data})
    })
});

// add comment
apiRoutes.post('/addReplyComments', (req, res, next) => {
  let reply = new replyInfos({
    commentId   : req.body.commentId,
    content     : req.body.content,
    targetUser  : req.body.auth,
    targetUserId: req.body.authId,
    user        : req.body.user,
    userId      : req.body.userId,
    create_at   : req.body.create_at
  });
  reply.save(next);
}, (req, res) => {
  res.status('200').json({success: true, code: 200})
})

module.exports = apiRoutes;
