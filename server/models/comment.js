'use strict';
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        //id
        id       : {
            type         : DataTypes.INTEGER,
            primaryKey   : true,
            autoIncrement: true
        },
        // 楼层
        floor    : {
            type: DataTypes.INTEGER
        },
        // 评论内容
        content  : {
            type: DataTypes.STRING
        },
        like_num : {
            type: DataTypes.INTEGER
        },
        // 评论发表时间
        create_at: {
            type: DataTypes.DATE
        },

    }, {
        freezeTableName: true,
        timestamps     : false
    });

    Comment.associate = function (models) {
        models.Comment.belongsTo(models.Post, {
            onDelete  : "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
        models.Comment.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
        models.Comment.hasMany(models.Reply);
    };

    return Comment;
};

