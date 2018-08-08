<template>
  <div>
    <el-row type="flex">第三方账号登录：</el-row>
    <el-row type="flex">
      <el-col>
        <img @click="toGitHub()" class="gitHubIcon" src="https://my-house.pek3b.qingstor.com/github.png" alt="gitHub">
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name   : 'third_party_login',
    data() {
      return {

      }
    },
    methods: {
      toGitHub() {
//        this.$http.get('/api/authGitHub').then(res => {
//          window.location.href = res.data.auth_url;
//        });
      }
    }
  }
</script>
<style lang="stylus">
  .gitHubIcon {
    width 40px
    height 40px
    cursor pointer
  }
</style>
