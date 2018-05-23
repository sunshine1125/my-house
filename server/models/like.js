const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let likeSchema = new Schema({
  articleId: String,
  active   : Boolean,
  user     : {type: Schema.Types.ObjectId, ref: 'frontUser'}
});

let Like = mongoose.model('Like', likeSchema);
module.exports = Like;



