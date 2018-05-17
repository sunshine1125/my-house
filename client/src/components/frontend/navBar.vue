<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top">
    <a class="navbar-brand" href="#/">小屋</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item" v-if="!hasLogin">
          <a class="nav-link" href="#/login">登录</a>
        </li>
        <li class="nav-item" v-if="!hasLogin">
          <a class="nav-link" href="#/register">注册</a>
        </li>
        <li class="pic nav-item dropdown" v-if="hasLogin">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown"
             aria-haspopup="true" aria-expanded="false">
            <img :src="imgSrc" width="40" height="40" alt="">
          </a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
            <a class="dropdown-item" href="#/login" @click="logout()">退出</a>
            <a class="dropdown-item" href="#/basicSetting">设置</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>

  export default {
    name      : 'navBar',
    data() {
      return {
        currentUserName: '',
        hasLogin       : false,
        imgSrc         : ''
      }
    },
    mounted   : function () {
      if (localStorage.getItem('currentUserId')) {
        this.hasLogin = true;
        this.getUserName(localStorage.getItem(('currentUserId')));
      } else {
        this.hasLogin = false;
      }
    },
    computed  : {},
    methods   : {
      getUserName(id) {
        this.$http.get(`/api/getUserById/${id}`).then(res => {
          this.currentUserName = res.data.data.username;
          this.imgSrc = res.data.data.avatar;
          let userInfo = {
            currentUserName: this.currentUserName,
            avatar         : this.imgSrc
          }
          localStorage.setItem('currentUserInfo', JSON.stringify(userInfo));
        })
      },
      logout() {
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserInfo');
      }
    },
    components: {}
  }
</script>
<style scoped lang="stylus">
  .navbar
    border-bottom 1px solid #e0e0e0
    width 100%
    z-index 100
    background-color #f5f5f5
    .pic
      .nav-link
        padding 0 0.5rem
      img
        border-radius 50%
</style>
