# myBlog
> 一个简单的博客系统，主要通过vue+node+express+mySql实现。
### 主要功能
* 注册
* 登录
* 文章管理
* 标签管理
* 评论
* 设置
### 前端
* [vue](https://cn.vuejs.org/v2/guide/), [vue-router](https://router.vuejs.org/guide/#html)
* 使用[vue-axios](https://www.npmjs.com/package/vue-axios)，管理http请求
* 使用[element-ui](http://element-cn.eleme.io/#/zh-CN/component/installation)框架,省去了许多繁琐的css代码
* [markdown编辑器](https://www.npmjs.com/package/mavon-editor)，功能强大且好用
### 后端
* [express](http://www.expressjs.com.cn/)
* [Sequelize](https://github.com/demopark/sequelize-docs-Zh-CN) 是一个基于 promise 的 Node.js ORM, 目前支持 Postgres, MySQL, SQLite 和 Microsoft SQL Server. 它具有强大的事务支持, 关联关系, 读取和复制等功能.
* 使用[Nodemailer](https://nodemailer.com/about/)实现发送邮件功能
* 上传的图片上传到青云，数据库只存储图片地址

 

### 前端启动

``` bash
# 进入client目录下, 安装前端依赖
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

### 后端启动

```bash
# 进入sever目录下，安装后端依赖
npm install

# 启动
npm start
```
暂时想到的就这么多，之后再优化吧！

