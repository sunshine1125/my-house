const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// 创建model
const User = sequelize.define('user', {
    userId  : {
        type         : Sequelize.INTEGER,
        primaryKey   : true,
        unique       : true,
        autoIncrement: true,
        field        : 'user_id'
    },
    userName: {
        type     : Sequelize.STRING, // 指定值的类型
        allowNull: false,
        field    : 'user_name'
    },
    // 没有指定field，表中键名称则与对象键名相同，为email
    email   : {
        type     : Sequelize.STRING,
        allowNull: false
    },
    phone   : {
        type: Sequelize.STRING
    },
    password: {
        type     : Sequelize.STRING,
        allowNull: false
    },
    avatar  : {
        type        : Sequelize.STRING,
        defaultValue: 'https://my-blog.pek3b.qingstor.com/default.jpg'
    }
}, {
    // 如果为true则表的名称和model相同，即user
    // 为false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: false
});

// 创建表
// User.sync() 会创建表并且返回一个Promise对象
// 如果 force = true 则会把存在的表(如果users表已存在) 先销毁再创建表
// 默认情况下 force = false

const user = User.sync({force: false});

//查找用户
exports.getAllUsers = () => {
    return user.then(() => {
        User.findAll({
            attributes: ['email']
        })
    })
};

// 添加新用户
exports.addUser = (userName, email, password) => {
    // 向user表中插入数据
    return user.then(() => {
        User.create({
            userName: userName,
            email   : email,
            password: password
        })
    })
    // return User.create({
    //     userName: userName,
    //     email   : email,
    //     password: password
    // });
};

exports.findByEmail = email => {
    return User.findOne({
        where: {
            email: email
        }
    })
};

// 通过用户名查找用户
exports.findByName = userName => {
    return User.findOne({
        where: {
            userName: userName
        }
    });
};

exports.deleteUserById = id => {
    return User.destroy({
        where: {
            userId: id
        }
    })
};

exports.updateUser = (userName, newEmail) => {
    return User.update({
        email: newEmail
    }, {
        where: {
            userName: userName
        }
    })
};