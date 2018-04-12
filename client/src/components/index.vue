<template>
  <div class="home">
    <el-container>
      <el-header>
        <ul class="header-operations">
          <li>欢迎 <span>{{username}}</span></li>
          <li @click="resetPassword()">重置密码</li>
          <li @click="logout()">退出</li>
        </ul>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!--左侧导航-->
          <div class="main-left">
            <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :router="true">
              <el-menu-item index="/userManager">用户管理</el-menu-item>
              <el-menu-item index="/articleManager">文章管理</el-menu-item>
              <el-menu-item index="/tagManager">标签管理</el-menu-item>
            </el-menu>
          </div>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name   : 'index',
    data() {
      return {
        email   : '',
        lists   : [],
        userId  : '',
        username: ''
      }
    },
    mounted: function () {
      if (localStorage.getItem('userInfo')) {
        this.email = JSON.parse(localStorage.getItem('userInfo')).email;
        this.$http.get('/api/getSingleUser/' + this.email).then((res) => {
          this.username = res.data.username;
        });
        this.userId = JSON.parse(localStorage.getItem('userInfo'))._id;
      } else {
        this.$router.push('/login');
      }
    },
    methods: {
      resetPassword() {
        this.$router.push('/resetPassword');
      },
      logout() {
        this.$router.push('/login');
        localStorage.removeItem('userInfo');
      }
    },
    components: {

    }
  }
</script>
<style>
  .home {
    height: 100%;
  }

  .home .el-container {
    height: 100%;
  }

  .home .el-header {
    background-color: rgb(64, 158, 255)
  }
  .header-operations {
    display: inline-block;
    float: right;
    padding-right: 30px;
    height: 100%;
  }
  .header-operations li {
    color: #fff;
    display: inline-block;
    vertical-align: middle;
    padding: 0 10px;
    margin: 0 10px;
    line-height: 60px;
    cursor: pointer;
    font-size: 16px;
  }
  #table {
    width: 100%;
    height: 100%;
    margin: 10px auto;
  }

  .container {
    margin-top: 25px;
  }

  aside .main-left {
    height: 100%;
  }

  aside .main-left ul {
    height: 100%;
  }

  #navbarSupportedContent ul {
    margin-left: auto !important;
    margin-right: 100px !important;
  }

  .el-table td .cell {
    height: 50px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-table th .cell {
    text-align: center;
  }
</style>
