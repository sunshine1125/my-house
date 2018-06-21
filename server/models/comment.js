const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CommentSchema = new Schema({
  auth         : String,
  authId       : String,
  content      : String,
  avatar       : String,
  date         : {type: Date, default: Date.now},
  articleId    : {type: Schema.Types.ObjectId, ref: 'post'},
  replyInfo    : [{type: Schema.Types.Object, ref: 'replyInfo'}]
});

let Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;



