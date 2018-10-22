'use strict';
module.exports = (sequelize, DataTypes) => {
    const Reply = sequelize.define('Reply', {
        // id
        id       : {
            type         : DataTypes.INTEGER,
            primaryKey   : true,
            autoIncrement: true
        },
        // 回复内容
        content  : {
            type: DataTypes.STRING
        },
        // 回复者
        auth   : {
          type : DataTypes.STRING
        },
        // 回复发表时间
        create_at: {
            type: DataTypes.DATE
        }
    }, {
        freezeTableName: true,
        timestamps     : false
    });

    Reply.associate = function (models) {
        models.Reply.belongsTo(models.Comment, {
            onDelete  : "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
        models.Reply.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    };

    return Reply;
};

