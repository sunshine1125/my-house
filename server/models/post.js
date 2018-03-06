const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PostSchema = new Schema({
    title: String,
    date : Date,
    uid  : {type: Schema.Types.ObjectId, ref : 'User'}
});

let Post = mongoose.model('Post', PostSchema);
module.exports = Post;



