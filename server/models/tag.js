const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TagSchema = new Schema({
    title  : String,
    // postId : {type: Schema.Types.ObjectId, ref: 'Post'}
});

let Tag = mongoose.model('Tag', TagSchema);
module.exports = Tag;



