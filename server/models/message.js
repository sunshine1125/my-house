'use strict';
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        //id
        id        : {
            type         : DataTypes.INTEGER,
            primaryKey   : true,
            autoIncrement: true
        },
        // 接收者id
        rec_id    : {
            type: DataTypes.INTEGER
        },
        // 是否查看
        status    : {
            type        : DataTypes.BOOLEAN,
            defaultValue: false
        },
        // 类型
        type      : {
            type: DataTypes.STRING
        },
        // 需要的标题
        type_title: {
            type: DataTypes.STRING
        }

    }, {
        freezeTableName: true,
        timestamps     : true
    });

    Message.associate = function (models) {
        models.Message.belongsTo(models.User, {
            as        : 'send',
            onDelete  : 'CASCADE',
            foreignKey: 'send_id'
        });
        models.Message.belongsTo(models.Comment, {
            as        : 'comment',
            onDelete  : 'CASCADE',
            foreignKey: {
                allowNull: true,
                name     : 'comment_id'
            }
        });
        models.Message.belongsTo(models.C_like, {
            as        : 'c_like',
            onDelete  : 'CASCADE',
            foreignKey: {
                allowNull: true,
                name     : 'c_like_id'
            }
        });
        models.Message.belongsTo(models.Post, {
            as        : 'post',
            onDelete  : 'CASCADE',
            foreignKey: {
                allowNull: true,
                name     : 'post_id'
            }
        });
        models.Message.belongsTo(models.P_like, {
            as        : 'p_post',
            onDelete  : 'CASCADE',
            foreignKey: {
                allowNull: true,
                name     : 'p_post_id'
            }
        });
        models.Message.belongsTo(models.P_like, {
            as        : 'like',
            onDelete  : 'CASCADE',
            foreignKey: {
                allowNull: true,
                name     : 'like_id'
            }
        });
        models.Message.belongsTo(models.User_Follow, {
            as        : 'follow',
            onDelete  : 'CASCADE',
            foreignKey: {
                allowNull: true,
                name     : 'follow_id'
            }
        });
    };

    return Message;
};

