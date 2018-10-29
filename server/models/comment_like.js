'use strict';
module.exports = (sequelize, DataTypes) => {
    const C_like = sequelize.define('C_like', {
        user_id   : {
            type: DataTypes.INTEGER
        },
        comment_id: {
            type: DataTypes.INTEGER
        }

    }, {
        freezeTableName: true,
        timestamps     : false
    });

    return C_like;
};

