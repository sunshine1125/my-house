'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id      : {
            type         : DataTypes.INTEGER,
            primaryKey   : true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING
        },
        email   : {
            type: DataTypes.STRING
        },
        phone   : {
            type: DataTypes.STRING
        },
        password: {
            type     : DataTypes.STRING,
            allowNull: false
        },
        avatar  : {
            type        : DataTypes.STRING,
            defaultValue: 'https://my-blog.pek3b.qingstor.com/default.jpg'
        }
    }, {
        freezeTableName: true,
        timestamps     : true, // 时间戳属性 (updatedAt, createdAt)
        createdAt      : 'CreatedAt',
        updatedAt      : 'UpdatedAt'
    });

    User.associate = function (models) {
        models.User.hasMany(models.Post);
        models.User.hasMany(models.Comment);
        models.User.hasMany(models.Tag);
    };

    return User;
};

