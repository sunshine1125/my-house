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
        this.$http.get(`/api/user/github/oauth?code=${code}`).then(res => {
          if (res.data.hasUser) {
            localStorage.setItem('currentUser', JSON.stringify(res.data.user));
            this.$router.push('/');
          } else {
            this.$http.get(`/api/user/github/${res.data.user.id}`).then(user => {
              localStorage.setItem('currentUser', JSON.stringify(user.data.user));
              this.$router.push('/');
            });
          }

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
