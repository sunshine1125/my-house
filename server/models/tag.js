'use strict';
module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag', {
        //id
        id       : {
            type         : DataTypes.INTEGER,
            primaryKey   : true,
            autoIncrement: true
        },
        // 标题
        title    : {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true
    });

    Tag.associate = function (models) {
        // models.Tag.belongsTo(models.User, {
        //     onDelete  : "CASCADE",
        //     foreignKey: {
        //         allowNull: false
        //     }
        // });
        models.Tag.hasMany(models.Post);
    };

    return Tag;
};

