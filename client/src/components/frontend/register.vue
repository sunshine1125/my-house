<template>
  <div class="register container">
    <img v-show="false" id="avatar" width="100" height="100" src="../../assets/default.jpg" alt="">
    <h3>小屋</h3>
    <form>
      <div class="form-group row" :class="{'form-group--error': $v.username.$error}">
        <label for="username" class="col-sm-3 col-3 col-form-label customLabel form__label">昵称</label>
        <div class="col-sm-9 col-9">
          <input type="text" v-model.trim="username" @blur="$v.username.$touch()" class="form-control form__input" id="username" placeholder="昵称">
        </div>
        <span class="form-group__message change__message form-error" v-if="!$v.username.required">昵称不能为空</span>
        <span class="form-group__message change__message form-error" v-if="!$v.username.minLength">昵称不能少于2个字符</span>
      </div>
      <div class="form-group row" :class="{'form-group--error': $v.phone.$error}">
        <label for="phone" class="col-sm-3 col-3 col-form-label customLabel form__label">手机号</label>
        <div class="col-sm-9 col-9">
          <input type="text" v-model.trim="phone" @blur="$v.phone.$touch()" class="form-control form__input" id="phone" placeholder="手机号">
        </div>
        <span class="form-group__message change__message form-error" v-if="!$v.phone.required">手机号不能为空</span>
      </div>
      <div class="form-group row" :class="{'form-group--error': $v.password.$error}">
        <label for="inputPassword" class="col-sm-3 col-3 col-form-label customLabel form__label">密码</label>
        <div class="col-sm-9 col-9">
          <input type="password" v-model="password" @blur="$v.password.$touch()" class="form-control form__input" id="inputPassword" placeholder="设置密码">
        </div>
        <span class="form-group__message change__message form-error" v-if="!$v.password.required">密码不能为空</span>
        <span class="form-group__message change__message form-error" v-if="!$v.password.minLength">密码不能少于4个字符</span>
      </div>
      <div class="form-group row">
        <div class="col-sm-3 col-3"></div>
        <div class="col-sm-9 col-9">
          <button :disabled="$v.validationGroup.$error || $v.validationGroup.$invalid" @click="register()" type="button" class="btn btn-primary btn-block">注册</button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-3 col-3"></div>
        <div class="col-sm-9 col-9">
          已有账户，去 <a href="#/login">登录</a>
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
  import { required, minLength } from 'vuelidate/lib/validators'
  export default {
    name   : 'register',
    data() {
      return {
        username    : '',
        phone       : '',
        password    : '',
        errorMessage: '',
        displayAlert: false
      }
    },
    validations: {
      username: {
        required,
        minLength: minLength(2)
      },
      phone: {
        required
      },
      password: {
        required,
        minLength: minLength(4)
      },
      validationGroup: ['username', 'phone', 'password']
    },
    methods: {
      register() {
        if (this.username && this.phone && this.password) {
          let data = {
            username: this.username,
            phone   : this.phone,
            password: this.password,
            avatar  : document.getElementById('avatar').getAttribute('src')
          };
          this.$http.post('/api/userRegister', data).then(res => {
            if (res.data.success) {
              this.errorMessage = '';
              this.displayAlert = false;
              this.$router.push('/');
              localStorage.setItem('currentUserId', res.data.data._id);
              localStorage.setItem('userInfo', JSON.stringify({
                username: this.username,
                phone   : this.phone,
                avatar  : document.getElementById('avatar').getAttribute('src'),
                roleId  : res.data.data.roleId,
                token   : res.data.data.token
              }))
            } else {
              this.displayAlert = true;
              this.errorMessage = res.data.message;
            }
          })
        }
      }
    }
  }
</script>
<style scoped lang="stylus">
  .register
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
      .form-error
        font-size smaller
        margin-left 30%
    .tipMessage
      position fixed
      bottom 10px
      right 10px

  @media screen and (max-width: 786px)
    .register
      width 100% !important
      height 100% !important
      margin-top 0 !important
      padding-top 150px !important
      form
        width 90% !important
        margin-left 0!important
        .customLabel
          padding-left 0px
          text-align center

  @media screen and (max-width: 480px)
    .register
      width 100% !important
      height 100% !important
      margin-top 0 !important
      padding-top 150px
      form
        width 90% !important
        margin-left 0!important
        .customLabel
          padding-left 0px
          text-align center

</style>
