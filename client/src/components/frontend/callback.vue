<template>
  <div>
  </div>
</template>

<script>
  export default {
    name      : 'callback',
    data() {
      return {
      }
    },
    mounted   : function () {
      let code = window.location.search.split('=')[1];
      if (code) {
        this.$http.get(`/api/github/oauth?code=${code}`).then(res => {
          let user = res.data.user;
          localStorage.setItem('gitHubLogin', true);
          let gitUser = {
            currentUserName: user.name,
            avatar         : user.avatar
          };
          localStorage.setItem('gitUserInfo', JSON.stringify(gitUser));
          this.$router.push('/')
        })
      }
    },
    methods   : {
    },
    components: {
    }
  }
</script>
<style scoped lang="stylus">
</style>
