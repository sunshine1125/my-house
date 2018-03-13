const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PostSchema = new Schema({
    image   : String,
    title   : String,
    content : String,
    tagTitle: String,
    date    : Date,
    uid     : {type: Schema.Types.ObjectId, ref: 'User'},
    // tagId   : [{type: Schema.Types.ObjectId, ref: 'Tag'}]
});

let Post = mongoose.model('Post', PostSchema);
module.exports = Post;



