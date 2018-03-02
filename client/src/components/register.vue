<template>
  <div class="register container">
    <h2>注册</h2>
    <form>
      <div class="form-group row" v-bind:class="{ 'form-group--error': $v.username.$error }">
        <label for="username" class="col-sm-3 col-form-label form__label">用户名</label>
        <div class="col-sm-8">
          <input type="text" class="form-control form__input" id="username" v-model.trim="username" @input="$v.username.$touch()" placeholder="请填写用户名">
        </div>
        <span class="form-group__message" v-if="!$v.username.required">用户名不能为空</span>
      </div>
      <div class="form-group row" v-bind:class="{ 'form-group--error': $v.mail.$error }">
        <label for="email" class="col-sm-3 col-form-label form__label">邮箱</label>
        <div class="col-sm-8">
          <input type="text" class="form-control form__input" id="email" v-model.trim="mail" @input="$v.mail.$touch()" placeholder="请填写邮箱">
        </div>
        <span class="form-group__message" v-if="!$v.mail.required">邮箱不能为空</span>
        <span class="form-group__message" v-if="!$v.mail.email">请填写格式正确的邮箱</span>
      </div>
      <div class="form-group row" v-bind:class="{ 'form-group--error': $v.password.$error }">
        <label for="inputPassword" class="col-sm-3 col-form-label form__label">密码</label>
        <div class="col-sm-8">
          <input type="password" class="form-control form__input" id="inputPassword" v-model.trim="password" @input="$v.password.$touch()" placeholder="请设置密码">
        </div>
        <span class="form-group__message" v-if="!$v.password.required">密码不能为空</span>
        <span class="form-group__message" v-if="!$v.password.minLength">密码长度不少于4个字符</span>
      </div>
      <div class="form-group row" v-bind:class="{ 'form-group--error': $v.passAgain.$error }">
        <label for="password" class="col-sm-3 col-form-label form__label">确认密码</label>
        <div class="col-sm-8">
          <input type="password" class="form-control form__input" id="password" v-model="passAgain" @input="$v.passAgain.$touch()" placeholder="请再次输入密码">
        </div>
        <span class="form-group__message" v-if="!$v.passAgain.required">密码不能为空</span>
        <span class="form-group__message" v-if="!$v.passAgain.minLength">两次输入密码应一致</span>
      </div>
      <div class="form-group row">
        <div class="col-sm-3"></div>
        <div class="col-sm-8">
          <button :disabled="$v.validationGroup.$error || $v.validationGroup.$invalid" class="btn btn-primary btn-block" type="button" @click="register()">注册</button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-3"></div>
        <div class="col-sm-8">
          已有账号，去<a href="/#/login">登录</a>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import swal from 'sweetalert2'
  import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

  export default {
    name   : 'register',
    data() {
      return {
        username : '',
        password : '',
        mail     : '',
        passAgain: ''
      }
    },
    validations: {
      username: {
        required
      },
      mail: {
        required, email
      },
      password: {
        required,
        minLength: minLength(4)
      },
      passAgain: {
        required,
        sameAsPassword: sameAs('password')
      },
      validationGroup: ['username', 'mail', 'password', 'passAgain']
    },
    methods: {
      register() {
        let userInfo = {
          "username": this.username,
          "password": this.password,
          'email'   : this.mail
        };
        this.$http.post('/api/register', userInfo)
          .then((res) => {
            if (res.data.success) {
              let email = {
                "email": this.mail
              };
              swal(res.data.message);
              this.$http.post('/api/sendEmail', email).then(res => {
                this.$router.push('/checkEmail');
              });

            } else {
              swal(res.data.message);
            }

          })
      }
    }
  }
</script>
<style scoped>
  .register {
    width: 35%;
    /*height: 300px;*/
    margin: auto;
    background: #eee;
    padding-top: 40px;
    padding-bottom: 40px;
    margin-top: 200px;
  }

  form {
    width: 80%;
    margin: 30px auto auto;
  }

  input, button {
    outline: none;
  }
  a {
    cursor: pointer;
  }
</style>
