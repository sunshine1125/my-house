<template>
  <el-header>
    <div class="header-wrapper">
      <h2 class="navBar"><a href="/">小屋</a></h2>
      <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="write" v-if="currentUser">
          <el-button size="small" round icon="el-icon-edit">写文章</el-button>
        </el-menu-item>
        <el-submenu index="user" v-if="currentUser">
          <template slot="title">
            <img class="image" :src="avatar" alt="" width="40" height="40">
          </template>
          <el-menu-item index="goAdmin">后台管理</el-menu-item>
          <el-menu-item index="settings">设置</el-menu-item>
          <el-menu-item index="reset">重置密码</el-menu-item>
          <el-menu-item index="logout">退出</el-menu-item>
        </el-submenu>
        <el-menu-item index="login" v-if="!currentUser">登录</el-menu-item>
        <el-menu-item index="register" v-if="!currentUser">注册</el-menu-item>
      </el-menu>
    </div>
  </el-header>
</template>

<script>
  export default {
    name   : 'topNav',
    data() {
      return {
        currentUser: JSON.parse(localStorage.getItem('currentUser')),
        avatar     : ''
      }
    },
    mounted: function () {
      if (this.currentUser) {
        this.avatar = this.currentUser.avatar;
      }
    },
    methods: {
      handleSelect(key) {
        if (key === 'write') {
          this.$router.push('/admin/articleManager/add');
        }
        if (key === 'goAdmin') {
          this.$router.push('/admin');
        }
        if (key === 'settings') {
          this.$router.push('/setting');
        }
        if (key === 'reset') {
          this.$router.push('/password/reset');
        }
        if (key === 'logout') {
          this.$router.push('/login');
          localStorage.clear();
        }
        if (key === 'login') {
          this.$router.push('/login');
        }
        if (key === 'register') {
          this.$router.push('/register');
        }
      }
    }
  }
</script>
<style lang="stylus">
  .el-header {
    width 100%
    background-color #fff
    z-index 250
    border-bottom 1px solid #e0e0e0
    padding 0 1rem !important
    .header-wrapper {
      height 100%
      margin 0 auto
      padding 0
      .navBar {
        float left
        font-weight normal
        cursor pointer
        padding-left 20px
        margin 0
        height 60px
        line-height 60px
       a {
          text-decoration none
          color #606266
          font-size 1.25rem
        }
      }
      .el-menu-demo {
        float right
        height 100%
        border none
        .image {
          -webkit-border-radius 50%
          -moz-border-radius 50%
          border-radius 50%
        }
        &:hover {
          border none!important
        }
        li {
          border none!important
          &:hover {
            border none!important
          }
        }
      }
    }
  }
</style>
