<template>
  <el-main>
    <el-row>
      <h3>
        啊偶，您要找的页面不存在！
      </h3>
    </el-row>
    <el-row>
      <el-button type="success" plain @click="goHome()">返回首页</el-button>
    </el-row>
  </el-main>
</template>

<script>
  export default {
    name      : 'notFound',
    data() {
      return {
      }
    },
    mounted   : function () {

    },
    methods   : {
      goHome() {
        this.$router.push('/');
      }
    },
    components: {
    }
  }
</script>
<style scoped lang="stylus">
  h3 {
    width 100%
    margin 100px auto 50px
  }
</style>
