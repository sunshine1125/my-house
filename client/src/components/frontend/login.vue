<template>
  <div class="login container">
    <h3>小屋</h3>
    <form>
      <div class="form-group row">
        <label for="phone" class="col-sm-3 col-form-label">手机号</label>
        <div class="col-sm-9">
          <input type="text" v-model="phone" class="form-control" id="phone" placeholder="手机号">
        </div>
      </div>
      <div class="form-group row">
        <label for="inputPassword" class="col-sm-3 col-form-label">密码</label>
        <div class="col-sm-9">
          <input type="password" v-model="password" class="form-control" id="inputPassword" placeholder="密码">
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-3"></div>
        <div class="col-sm-9">
          <button @click="login()" type="button" class="btn btn-primary btn-block">登录</button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-3"></div>
        <div class="col-sm-9">
          还没有账户，去 <a href="#/register">创建 </a>一个吧！
        </div>
      </div>
    </form>
    <div class="alert alert-warning alert-dismissible fade tipMessage" :class="{show: displayAlert}" role="alert">
      <span>{{errorMessage}}</span>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name   : 'login',
    data() {
      return {
        phone       : '',
        password    : '',
        errorMessage: '',
        displayAlert: false
      }
    },
    mounted: function () {

    },
    methods: {
      login() {
        let data = {
          phone   : this.phone,
          password: this.password
        }
        this.$http.post('/api/login', data).then(res => {
          if (res.data.success) {
            this.errorMessage = '';
            this.displayAlert = false;
            this.$router.push('/');
            localStorage.setItem('currentUserId', res.data._id);
            localStorage.setItem('userInfo', JSON.stringify({
              phone   : this.phone,
              roleId  : res.data.roleId,
              token   : res.data.token
            }))
          } else {
            this.displayAlert = true;
            this.errorMessage = res.data.message;
          }
        })
      }
    }
  }
</script>
<style scoped lang="stylus">
  .login
    margin auto
    width 30%
    background #eee
    padding-top 40px
    padding-bottom 20px
    margin-top 150px
    form
      width 80%
      margin-top 30px
      margin-left 30px
    .tipMessage
      position fixed
      bottom 10px
      right 10px

  @media screen and (max-width: 480px)
    .register
      width 100% !important
      margin-top 0 !important
      height 100% !important

</style>
