const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CommentSchema = new Schema({
  auth     : String,
  authId   : String,
  content  : String,
  date     : {type: Date, default: Date.now},
  articleId: {type: Schema.Types.ObjectId, ref: 'post'}
});

let Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;



