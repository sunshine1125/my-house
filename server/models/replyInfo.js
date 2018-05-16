const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let replyInfoSchema = new Schema({
  replyContent : String,
  replyPerson  : String,
  replyPersonId: String,
  commentId    : {type: Schema.Types.ObjectId, ref: 'post'}
});

let replyInfo = mongoose.model('replyInfo', replyInfoSchema);
module.exports = replyInfo;



