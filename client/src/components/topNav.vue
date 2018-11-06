<template>
  <el-header>
    <el-row class="header-wrapper">
      <el-col :span="2">
        <h2 class="navBar"><a @click="goHome()">小屋</a></h2>
      </el-col>
      <el-col :span="22">
        <el-row type="flex" class="row-bg" justify="end">
          <el-menu :default-active="currentIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="discover">
              <a>
                <span>发现</span>
              </a>
            </el-menu-item>
            <el-menu-item index="follow">
              <a>
                <span>关注</span>
              </a>
            </el-menu-item>
            <el-menu-item index="news">
              <a>
                <span>消息</span>
              </a>
            </el-menu-item>
            <el-menu-item index="write" v-if="currentUser">
              <el-button size="small" round icon="el-icon-edit">写文章</el-button>
            </el-menu-item>
            <el-submenu index="user" v-if="currentUser">
              <template slot="title">
                <img class="image" :src="avatar" alt="" width="40" height="40">
              </template>
              <el-menu-item index="profile">我的主页</el-menu-item>
              <el-menu-item index="goAdmin">后台管理</el-menu-item>
              <el-menu-item index="settings">设置</el-menu-item>
              <el-menu-item index="reset">重置密码</el-menu-item>
              <el-menu-item index="logout">退出</el-menu-item>
            </el-submenu>
            <el-menu-item index="login" v-if="!currentUser">登录</el-menu-item>
            <el-menu-item index="register" v-if="!currentUser">注册</el-menu-item>
          </el-menu>
        </el-row>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
  export default {
    name   : 'topNav',
    data() {
      return {
        currentUser : JSON.parse(localStorage.getItem('currentUser')),
        avatar      : '',
        currentIndex: localStorage.getItem('currentTab') || 'discover'
      }
    },
    mounted: function () {
      if (this.currentUser) {
        this.avatar = this.currentUser.avatar;
      }
    },
    methods: {
      goHome() {
        this.$router.push('/');
        localStorage.setItem('currentTab', 'discover')
      },
      handleSelect(key) {
        if (key === 'discover') {
          this.$router.push('/');
          localStorage.setItem('currentTab', key);
        }
        if (key === 'follow') {
          this.$router.push('/follow');
          localStorage.setItem('currentTab', key);
        }
        if (key === 'news') {
          this.$router.push('/news');
          localStorage.setItem('currentTab', key);
        }
        if (key === 'write') {
          this.$router.push('/admin/articleManager/add');
          localStorage.setItem('currentTab', key);
        }
        if (key === 'profile') {
          this.$router.push(`/u/${this.currentUser.id}`);
          localStorage.setItem('currentTab', key);
        }
        if (key === 'goAdmin') {
          this.$router.push('/admin');
          localStorage.setItem('currentTab', key);
        }
        if (key === 'settings') {
          this.$router.push('/setting');
          localStorage.setItem('currentTab', key);
        }
        if (key === 'reset') {
          this.$router.push('/password/reset');
          localStorage.setItem('currentTab', key);
        }
        if (key === 'logout') {
          this.$router.push('/login');
          localStorage.clear();
          localStorage.setItem('currentTab', 'discover');
        }
        if (key === 'login') {
          this.$router.push('/login');
          localStorage.setItem('currentTab', 'discover');
        }
        if (key === 'register') {
          this.$router.push('/register');
          localStorage.setItem('currentTab', 'discover');
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
    height 61px !important
    .header-wrapper {
      height 100%
      margin 0 auto
      padding 0
      text-align left
      .navBar {
        font-weight normal
        cursor pointer
        padding-left 20px
        height 60px
        line-height 60px
        margin 0
        a {
          text-decoration none
          color #606266
          font-size 1.25rem
        }
      }
      .el-menu-demo {
      }
    }
  }
</style>
