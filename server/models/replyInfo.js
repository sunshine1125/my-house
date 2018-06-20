const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let replyInfoSchema = new Schema({
  content     : String,
  targetUser  : String,
  targetUserId: Number,
  user        : String,
  userId      : Number,
  commentId   : {type: Schema.Types.ObjectId, ref: 'post'},
  create_at   : {type: Date, default: Date.now}
});

let replyInfo = mongoose.model('replyInfo', replyInfoSchema);
module.exports = replyInfo;



