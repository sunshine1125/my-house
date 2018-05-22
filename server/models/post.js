const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PostSchema = new Schema({
  image     : String,
  title     : String,
  content   : String,
  tagTitle  : String,
  date      : {type: Date, default: Date.now},
  uid       : {type: Schema.Types.ObjectId, ref: 'User'},
  tagId     : {type: Schema.Types.ObjectId, ref: 'Tag'},
  likeNum   : Number,
  likeActive: Boolean
});

let Post = mongoose.model('Post', PostSchema);
module.exports = Post;



