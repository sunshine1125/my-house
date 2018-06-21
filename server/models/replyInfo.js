const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let replyInfoSchema = new Schema({
  content     : String,
  targetUser  : String,
  targetUserId: String,
  user        : String,
  userId      : String,
  commentId   : {type: Schema.Types.ObjectId, ref: 'comment'},
  create_at   : {type: Date, default: Date.now}
});

let replyInfo = mongoose.model('replyInfo', replyInfoSchema);
module.exports = replyInfo;



