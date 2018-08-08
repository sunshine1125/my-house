const Sequelize = require('sequelize');
module.exports = new Sequelize('blog', 'root', null, {
    host   : 'localhost',
    dialect: 'mysql',
    pool   : {
        max : 5, // 连接池中最大连接数量
        min : 0, // 连接池中最小连接数量
        idle: 10000 // 如果一个线程10秒钟内没有被使用过的话，那么就释放线程
    }
});