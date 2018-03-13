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
            <el-menu :default-active="indexMenu" class="el-menu-vertical-demo" :router="true">
              <el-menu-item @click="isArticle()" index="/articleManager" :class="{'isActive': active}">文章管理</el-menu-item>
              <el-menu-item @click="isTag()" index="/tagManager" :class="{'isActive': !active}">标签管理</el-menu-item>
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
  import swal from 'sweetalert2'

  export default {
    name   : 'index',
    data() {
      return {
        active  : true,
        username: '',
        lists   : [],
        userId  : '',
        indexMenu: '/articleManager'
      }
    },
    mounted: function () {
      if (localStorage.getItem('username')) {
        this.username = JSON.parse(localStorage.getItem('username')).username;
        this.userId = JSON.parse(localStorage.getItem('username'))._id;
      } else {
        this.$router.push('/login');
      }
      this.active = JSON.parse(localStorage.getItem('active')).active;
      this.active === true ? this.indexMenu = '/articleManager' : this.indexMenu = '/tagManager';
    },
    methods: {
      logout() {
        this.$router.push('/login');
        localStorage.removeItem('username');
      },
      isArticle() {
        this.active = true;
        localStorage.setItem('active', JSON.stringify({'active': this.active}));
      },
      isTag() {
        this.active = false;
        localStorage.setItem('active', JSON.stringify({'active': this.active}));
      }
    }
  }
</script>
<style>
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
