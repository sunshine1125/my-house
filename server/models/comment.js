'use strict';
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        //id
        id       : {
            type         : DataTypes.INTEGER,
            primaryKey   : true,
            autoIncrement: true
        },
        // 评论内容
        content  : {
            type: DataTypes.STRING
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
        })
    };

    return Comment;
};

