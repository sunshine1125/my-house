const express = require('express');
const apiRoutes = express.Router();
const replyInfos = require('../models/replyInfo');

apiRoutes.get('/comment/:commentId/getReply', (req, res) => {
  let commentId = req.params.commentId;
  let matchData = [];
  replyInfos.find()
    .populate('commentId')
    .exec((err, data) => {
      data.forEach(item => {
        if (item.commentId._id == commentId) {
          matchData.push(item);
        }
      });
      res.status(200).json(matchData);
    })
});

apiRoutes.get('/reply/:replyId', (req, res) => {
  let replyId = req.params.replyId;
  replyInfos.findOne({_id: replyId})
    .exec((err, data) => {
      res.status(200).json(data);
    })
})

// add comment
let newData = {};
apiRoutes.post('/addReplyComments', (req, res, next) => {
  newData = {
    commentId   : req.body.commentId,
    content     : req.body.content,
    targetUser  : req.body.auth,
    targetUserId: req.body.authId,
    user        : req.body.user,
    userId      : req.body.userId,
    create_at   : req.body.create_at
  }
  let reply = new replyInfos(newData);
  reply.save(next);
}, (req, res) => {
  res.status('200').json({success: true, code: 200, data: newData})
})

module.exports = apiRoutes;
