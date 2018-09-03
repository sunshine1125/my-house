<template>
  <el-container class="admin">
    <el-aside width="200px" class="aside">
      <!--左侧导航-->
      <div class="main-left">
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :router="true">
          <el-menu-item class="goHome" index="/">回首页</el-menu-item>
          <el-menu-item index="/admin/articleManager">文章管理</el-menu-item>
          <el-menu-item v-if="currentUser.admin" index="/admin/tagManager">标签管理</el-menu-item>
          <el-menu-item index="/admin/userManager">用户管理</el-menu-item>
        </el-menu>
      </div>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name   : 'index',
    data() {
      return {
        currentUser: JSON.parse(localStorage.getItem('currentUser'))
      }
    },
    mounted: function() {
      if (!this.currentUser) {
        this.$router.push('/login');
      }
    }
  }
</script>
<style lang="stylus">
  .admin {
    width 100%
    height 100%
    aside {
      height 100%
      .main-left {
        height 100%
        ul {
          height 100%
          .goHome {
            border-bottom 1px solid #f1f1f1
          }
        }
      }
    }
    main {
      .el-table {
        .cell {
          overflow hidden
          -ms-text-overflow: ellipsis
          text-overflow: ellipsis
          white-space nowrap
        }
      }
      .el-button {
        outline: none
      }

      .circle {
        padding 6px 6px;
      }

      .el-row {
        text-align: left;
        margin-bottom: 10px;
      }
      tr {
        th {
          text-align center
        }
      }
    }
  }

  @media (max-width: 768px)
    .aside {
      display none
    }
</style>
