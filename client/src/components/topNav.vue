<template>
  <el-header>
    <div class="header-wrapper">
      <h2 class="navBar"><a href="/">小屋</a></h2>
      <el-dropdown class="header-operations" @command="handleCommand">
          <span class="el-dropdown-link">
            <img class="image" :src="avatar" alt="" width="40" height="40"><i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="goAdmin">后台管理</el-dropdown-item>
          <el-dropdown-item command="goSetting">设置</el-dropdown-item>
          <el-dropdown-item command="resetPassword">重置密码</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
  export default {
    name   : 'topNav',
    data() {
      return {
        avatar: ''
      }
    },
    mounted: function () {
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        this.avatar = currentUser.avatar;
      }
    },
    methods: {
      handleCommand(command) {
        if (command === 'goAdmin') {
          this.$router.push('/admin');
        }
        if (command === 'goSetting') {
          this.$router.push('/setting');
        }
        if (command === 'resetPassword') {
          this.$router.push('/admin/resetPassword');
        }
        if (command === 'logout') {
          this.$router.push('/login');
          localStorage.clear();
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
    padding .5rem 1rem
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
        height 100%
        a {
          text-decoration none
          color #606266
          font-size 1.25rem
        }
      }
      .header-operations {
        float right
        height 100%
        .image {
          -webkit-border-radius 50%
          -moz-border-radius 50%
          border-radius 50%
        }
      }
    }
  }
</style>
