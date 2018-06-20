const express = require('express');
const apiRoutes = express.Router();
const replyInfos = require('../models/replyInfo');

// get comment
apiRoutes.get('/getReplyComments', (req, res) => {
  replyInfos.find()
    .exec((err, data) => {
      if (err) {
        // console.log(err);
      }
      console.log(data.length)
      res.status('200').json({success: true, code: 200, data: data})
    })
});

// add comment
apiRoutes.post('/addReplyComments', (req, res) => {
  let reply = new replyInfos({
    commentId   : req.body.commentId,
    content     : req.body.content,
    targetUser  : req.body.auth,
    targetUserId: req.body.authId,
    user        : req.body.user,
    userId      : req.body.userId,
    create_at   : req.body.create_at
  });
  reply.save();
  res.status('200').json({success: true, code: 200})
})

module.exports = apiRoutes;
