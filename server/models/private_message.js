'use strict';
module.exports = (sequelize, DataTypes) => {
    const P_message = sequelize.define('P_message', {
        //id
        id     : {
            type         : DataTypes.INTEGER,
            primaryKey   : true,
            autoIncrement: true
        },
        // 接收者id
        rec_id : {
            type: DataTypes.INTEGER
        },
        // 私信内容
        content: {
            type: DataTypes.STRING
        },
        // 楼层
        floor  : {
            type         : DataTypes.INTEGER
        }
    }, {
        freezeTableName: true,
        timestamps     : true
    });

    P_message.associate = function (models) {
        models.P_message.belongsTo(models.User, {
            as        : 'send',
            onDelete  : 'CASCADE',
            foreignKey: 'send_id'
        });
    };

    return P_message;
};

