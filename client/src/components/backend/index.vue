<template>
  <div class="home">
    <el-container>
      <el-header>
        <el-dropdown class="header-operations" @command="handleCommand">
          <span class="el-dropdown-link">
            欢迎 <span>{{username}}</span><i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="goArticlesList" @click="goArticlesList()">文章首页</el-dropdown-item>
            <el-dropdown-item command="resetPassword" @click="resetPassword()">重置密码</el-dropdown-item>
            <el-dropdown-item command="logout" @click="logout()">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="10%">
          <!--左侧导航-->
          <div class="main-left">
            <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :router="true">
              <!--<el-menu-item index="/userManager">用户管理</el-menu-item>-->
              <el-menu-item index="/admin/articleManager">文章管理</el-menu-item>
              <el-menu-item index="/admin/tagManager">标签管理</el-menu-item>
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
        this.$http.get(`/api/getSingleUser/${this.email}`).then((res) => {
          this.username = res.data.username;
        });
        this.userId = JSON.parse(localStorage.getItem('userInfo'))._id;
      } else {
        this.$router.push('/admin/login');
      }
    },
    methods: {
      handleCommand(command) {
        if (command === 'resetPassword') {
          this.$router.push('/admin/resetPassword');
        }
        if (command === 'logout') {
          this.$router.push('/admin/login');
          localStorage.clear();
        }
        if (command === 'goArticlesList') {
          this.$router.push('/');
          localStorage.setItem('currentUserId', this.userId);
        }
      }
    },
    components: {

    }
  }
</script>
<style lang="stylus">
  .home {
    height: 100%;
  }

  .home .el-container {
    height: 100%;
  }

  .home .el-header {
    background-color: rgb(64, 158, 255);
  }

  .header-operations {
    display: inline-block;
    float: right;
    padding-right: 30px;
    height: 100%;
    vertical-align: middle;
    margin: 0 10px;
    line-height: 70px;
    cursor: pointer;
    color: #fff;
    font-size: 16px;
  }

  #table {
    width: 100%;
    height: 100%;
    margin: 10px auto;
  }

  .container {
    margin-top: 25px
  }

  aside .main-left {
    height: 100%
  }

  aside .main-left ul {
    height: 100%
  }

  #navbarSupportedContent ul {
    margin-left: auto !important;
    margin-right: 100px !important
  }

  .el-table td .cell {
    height: 50px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-table th .cell {
    text-align: center
  }

  /*main {*/
    /*background-color: #e9eef3;*/
  /*}*/
</style>
