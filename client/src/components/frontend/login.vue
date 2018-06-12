<template>
  <div class="login container">
    <h3>小屋</h3>
    <form>
      <div class="form-group row" :class="{'form-group--error': $v.phone.$error}">
        <label for="phone" class="col-sm-3 col-3 col-form-label customLabel form__label">手机号</label>
        <div class="col-sm-9 col-9">
          <input type="text" v-model.trim="phone" @blur="$v.phone.$touch()" class="form-control form__input" id="phone" placeholder="手机号">
        </div>
        <span class="form-group__message change__message form-error" v-if="!$v.phone.required">手机号不能为空</span>
      </div>
      <div class="form-group row" :class="{'form-group--error': $v.password.$error}">
        <label for="inputPassword" class="col-sm-3 col-form-label col-3 customLabel form__label">密码</label>
        <div class="col-sm-9 col-9">
          <input type="password" v-model="password" @blur="$v.password.$touch()" class="form-control form__input" id="inputPassword" placeholder="密码">
        </div>
        <span class="form-group__message change__message form-error" v-if="!$v.password.required">密码不能为空</span>
        <span class="form-group__message change__message form-error" v-if="!$v.password.minLength">密码不能少于4个字符</span>
      </div>
      <div class="form-group row">
        <div class="col-sm-3 col-3"></div>
        <div class="col-sm-9 col-9">
          <button :disabled="$v.validationGroup.$error || $v.validationGroup.$invalid" @click="login()" type="button" class="btn btn-primary btn-block">登录</button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-3 col-3"></div>
        <div class="col-sm-9 col-9">
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
  import { required, minLength } from 'vuelidate/lib/validators'

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
    validations: {
      phone: {
        required,
      },
      password: {
        required,
        minLength: minLength(4)
      },
      validationGroup: ['phone', 'password']
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
      .form-error
        font-size smaller
        margin-left 30%
    .tipMessage
      position fixed
      bottom 10px
      right 10px

  @media screen and (max-width: 786px)
    .login
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
    .login
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
