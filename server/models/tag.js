'use strict';
module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag', {
        //id
        id    : {
            type         : DataTypes.INTEGER,
            primaryKey   : true,
            autoIncrement: true
        },
        // 标题
        title : {
            type: DataTypes.STRING
        },
        UserId: {
            type: DataTypes.INTEGER,
        }
    }, {
        freezeTableName: true
    });

    Tag.associate = function (models) {
        models.Tag.hasMany(models.Post);
    };

    return Tag;
};

