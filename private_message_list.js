'use strict';
module.exports = (sequelize, DataTypes) => {
    const P_msg_list = sequelize.define('P_msg_list', {
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
        // 最新消息
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

    P_msg_list.associate = function (models) {
        P_msg_list.hasMany(models.P_message);
    };

    return P_msg_list;
};

