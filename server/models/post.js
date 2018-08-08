const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Post = sequelize.define('post', {
    //文章id
    postId   : {
        type         : Sequelize.INTEGER,
        primaryKey   : true,
        unique       : true,
        autoIncrement: true
    },
    // 文章封面
    cover    : {
        type: Sequelize.STRING
    },
    // 文章标题
    title    : {
        type: Sequelize.STRING
    },
    // 文章作者  外键
    authId : {
        type: Sequelize.INTEGER,
        references: {
            model: user,
            key : 'userId'
        }
    },
    // 文章内容
    content  : {
        type: Sequelize.STRING
    },
    // 文章发表时间
    create_at: {
        type: Sequelize.DATE
    }
}, {
    freezeTableName: false
});

let post = Post.sync();

// 发表新文章
exports.newPost = function (data) {
    return post.then(function () {
        Post.create({
            cover    : data.cover,
            title    : data.title,
            content  : data.content,
            authId   : data.authId,
            create_at: Date.now()
        });
    });
};

// 查找所以文章
exports.findAllPosts = function () {
    return Post.findAll();
};

// 通过 ID 查找文章
exports.findById = function (id) {
    return Post.findById(id);
};
