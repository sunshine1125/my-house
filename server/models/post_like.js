'use strict';
module.exports = (sequelize, DataTypes) => {
    const P_like = sequelize.define('P_like', {
        id       : {
            type         : DataTypes.INTEGER,
            primaryKey   : true,
            autoIncrement: true
        }
    }, {
        freezeTableName: true,
        timestamps     : false
    });

    P_like.associate = function (models) {
        models.P_like.belongsTo(models.User, {
            onDelete  : "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
        models.P_like.belongsTo(models.Post, {
            onDelete  : "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    return P_like;
};

