<template>
  <div class="home">
    <el-container>
      <el-header>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <a class="nav-link" href="#">欢迎 <span>{{username}}</span></a>
              </li>
              <li class="nav-item active">
                <a class="nav-link" href="/#/resetPassword">重置密码</a>
              </li>
              <li class="nav-item">
                <a style="cursor: pointer;" class="nav-link" @click="logout()">退出</a>
              </li>
            </ul>
          </div>
        </nav>
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
        this.userId = JSON.parse(localStorage.getItem('userInfo'))._id;
        this.$http.get('/api/getSingleUser/' + this.email).then((res) => {
          this.username = res.data.username;
        });
      } else {
        this.$router.push('/login');
      }
    },
    methods: {
      logout() {
        this.$router.push('/login');
        localStorage.removeItem('userInfo');
      }
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
