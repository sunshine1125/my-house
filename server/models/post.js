'use strict';
module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        //文章id
        id         : {
            type         : DataTypes.INTEGER,
            primaryKey   : true,
            autoIncrement: true
        },
        // 文章封面
        cover      : {
            type: DataTypes.STRING
        },
        // 文章标题
        title      : {
            type: DataTypes.STRING
        },
        // 文章内容
        content    : {
            type: DataTypes.TEXT
        },
        // 文章发表时间
        create_at  : {
            type: DataTypes.DATE
        },
        // 文章点赞数
        like_num   : {
            type        : DataTypes.INTEGER,
            defaultValue: 0
        },
        // 文章评论数
        comment_num: {
            type        : DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        freezeTableName: true,
        timestamps     : false
    });

    Post.associate = function (models) {
        models.Post.belongsTo(models.User, {
            onDelete  : "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
        models.Post.hasMany(models.Comment);
        models.Post.belongsTo(models.Tag, {
            onDelete  : "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
        models.Post.hasMany(models.P_like);
    };

    return Post;
};

