<template>
  <div class="header-wrapper">
    <el-header>
      <h2 class="navBar"><a href="/">小屋</a></h2>
      <el-dropdown class="header-operations" @command="handleCommand">
          <span class="el-dropdown-link">
            <img :src="avatar" alt="" width="40" height="40"><i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="goAdmin">后台管理</el-dropdown-item>
          <el-dropdown-item command="goSetting">设置</el-dropdown-item>
          <el-dropdown-item command="resetPassword">重置密码</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
  </div>
</template>

<script>
  export default {
    name   : 'topNav',
    data() {
      return {
        avatar: JSON.parse(localStorage.getItem('currentUser')).avatar
      }
    },
    mounted: function () {
    },
    methods: {
      handleCommand(command) {
        if (command === 'goAdmin') {
          this.$router.push('/admin');
        }
        if (command === 'goSetting') {
          this.$router.push('/basicSetting');
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
  .header-wrapper {
    width 100%
    background-color #fff
    position fixed
    top 0
    z-index 250
    border-bottom 1px solid #f1f1f1
    .el-header {
      max-width 960px
      min-width 768px
      height 100%
      margin 0 auto
      padding 0
      .navBar {
        float left
        font-weight normal
        cursor pointer
        padding-left 20px
        a {
          text-decoration none
          color #606266
        }
      }
      .header-operations {
        float right
        height 100%
      }
    }
  }
</style>
