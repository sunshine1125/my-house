<template>
  <div class="login">
    <div class="main container">
      <h3>登 录</h3>
      <el-form :model="loginForm" ref="loginForm">
        <el-form-item prop="email" :rules="validate_rules({required: true, type: 'email'})">
          <el-input v-model="loginForm.email" placeholder="邮箱" @keyup.enter.native="login('loginForm')"></el-input>
        </el-form-item>
        <el-form-item prop="password" :rules="validate_rules({required: true, type: 'password'})">
          <el-input type="password" v-model="loginForm.password" placeholder="密码" @keyup.enter.native="login('loginForm')"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" style="width: 100%" @click="login('loginForm')">登录</el-button>
          <el-row type="flex" class="row-bg">
            <el-col :span="12" style="text-align: left">
              没有账号？
              <el-button type="text" @click="goRegister()">注册</el-button>
            </el-col>
            <el-col :span="6" :offset="6" style="text-align: right;">
              <a @click="forgotPassword()">忘记密码</a>
            </el-col>
          </el-row>
          <third-party-login></third-party-login>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import thirdPartyLogin from '../third_party_login.vue'
  export default {
    name   : 'login',
    data() {
      return {
        loginForm: {
          email   : '',
          password: ''
        }
      }
    },
    mounted: function () {

    },
    methods: {
      login(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let userInfo = {
              "email"   : this.loginForm.email,
              "password": this.loginForm.password
            };
            this.$http.post('/api/user/auth', userInfo).then(res => {
              if (res.data.success) {
                this.$message({
                  message: res.data.msg,
                  type   : 'success'
                });
                localStorage.setItem('currentUser', JSON.stringify(res.data.user));
                localStorage.setItem('currentTab', 'discover');
                this.$router.push('/');
              } else {
                this.$message.error(res.data.msg);
              }
            })
          } else {
            return false;
          }
        })
      },
      goRegister() {
        this.$router.push('/register');
      },
      forgotPassword() {
        this.$router.push('/password/forgot');
      }
    },
    components: {
      thirdPartyLogin
    }
  }
</script>
<style scoped lang="stylus">
  .login {
    height 100%
    font-size 14px
    width 100%
    position absolute
    top 0
    left 0
    .main {
      min-width 300px
      max-width 400px
      margin 60px auto 0
      padding 50px 50px 30px
      background-color #fff
      border-radius 4px
      box-shadow 0 0 8px rgba(0, 0, 0, .1)
      h3 {
        font-size 28px
        color #ea6f5a
        word-spacing 4px
      }
      form {
        width 80%
        margin-top 30px
        margin-left 33px
        input, button {
          outline none
        }
        a {
          cursor pointer
        }
        p {
          margin-top 0
        }
      }
    }
  }

  @media (max-width: 768px)
    .login {
      background-color transparent
      .main {
        position absolute
        left 50%
        margin 0 0 0 -200px
        box-shadow none
        height 100%
      }
    }
</style>
