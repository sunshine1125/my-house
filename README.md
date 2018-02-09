# vue-express

> vue+node+mongodb

## 前端启动

``` bash
# 安装依赖 进入client目录下
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 后端启动


``` bash
# 先启动数据库，以我的数据库为例
打开终端 输入
 * cd C:\Program Files\MongoDB\Server\3.6
 * mongod.exe --dbpath D:\liu.com\database
 * 显示waiting for connections on port 27017表示启动成功
再打开一个终端 输入
 * mongo.exe
 * show dbs 查看所有数据库
 * show collections 查看所有集合
 * db.logins.find()查看集合名为logins下的所有数据
 
# 进入server目录，输入node index.js或nodemon,后端启动成功

```

