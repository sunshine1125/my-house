'use strict';
module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        //文章id
        id       : {
            type         : DataTypes.INTEGER,
            primaryKey   : true,
            autoIncrement: true
        },
        // 文章封面
        cover    : {
            type: DataTypes.STRING
        },
        // 文章标题
        title    : {
            type: DataTypes.STRING
        },
        // 文章内容
        content  : {
            type: DataTypes.STRING
        },
        // 文章发表时间
        create_at: {
            type: DataTypes.DATE
        },
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
    };

    return Post;
};

