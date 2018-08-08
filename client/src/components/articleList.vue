<template>
  <el-container class="wrapper">
    <top-nav></top-nav>
  </el-container>
  <!--<div class="articleList">-->
    <!--<top-nav></top-nav>-->
    <!--<div>我是主页</div>-->
  <!--</div>-->
</template>

<script>
  import topNav from './topNav.vue'
  export default {
    name   : 'articleList',
    data() {
      return {

      }
    },
    mounted: function () {

    },
    methods: {

    },
    components: {
      topNav
    }
  }
</script>
<style scoped lang="stylus">
  .wrapper {
    width 100%
    height 100%
  }
</style>
