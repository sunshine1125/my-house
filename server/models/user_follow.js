'use strict';
module.exports = (sequelize, DataTypes) => {
    const User_Follow = sequelize.define('User_Follow', {
        id     : {
            type         : DataTypes.INTEGER,
            primaryKey   : true,
            autoIncrement: true
        },
        // 关注者id
        user_id: {
            type: DataTypes.STRING
        },
    }, {
        freezeTableName: true,
        timestamps     : true, // 时间戳属性 (updatedAt, createdAt)
        createdAt      : 'CreatedAt',
        updatedAt      : 'UpdatedAt'
    });

    User_Follow.associate = function (models) {
        models.User_Follow.belongsTo(models.User, {
            as        : 'follow',
            onDelete  : "SET NULL",
            foreignKey: 'follow_id'
        });
    };

    return User_Follow;
};

