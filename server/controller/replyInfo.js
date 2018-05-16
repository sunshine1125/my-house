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
      res.status('200').json({success: true, code: 200, data: data})
    })
});

// add comment
apiRoutes.post('/addReplyComments', (req, res) => {
  let reply = new replyInfos({
    commentId    : req.body.commentId,
    replyContent : req.body.replyContent,
    replyPerson  : req.body.replyPerson,
    replyPersonId: req.body.replyPersonId
  });
  reply.save();
  res.status('200').json({success: true, code: 200})
});

module.exports = apiRoutes;
