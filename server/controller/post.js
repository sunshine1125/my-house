const post = require('../models/post2');

// // 插入一篇文章
// post.newPost('post title', 'post content').then(function() {
//     // 通过ID查找文章
//     return post.findById(1);
// }).then(function(p) {
//     console.log('********************************');
//     console.log('post title: ', p.title);
//     console.log('post content: ', p.content);
// });

module.exports = apiRoutes;
