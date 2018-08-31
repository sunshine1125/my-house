<template>
  <div class="register">
    <div class="main container">
      <h3>注 册</h3>
      <el-form :model="registerForm" ref="registerForm" class="demo-ruleForm">
        <el-form-item prop="username" :rules="validate_rules({required: true})">
          <el-input v-model="registerForm.username" placeholder="用户名" @keyup.enter.native="register('registerForm')"></el-input>
        </el-form-item>
        <el-form-item prop="email" :rules="validate_rules({required: true, type: 'email'})">
          <el-input v-model="registerForm.email" placeholder="邮箱" @keyup.enter.native="register('registerForm')"></el-input>
        </el-form-item>
        <el-form-item prop="password" :rules="validate_rules({required: true, type: 'password'})">
          <el-input type="password" v-model="registerForm.password" placeholder="密码" @keyup.enter.native="register('registerForm')"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" style="width: 100%" @click="register('registerForm')">注册</el-button>
          已有账号，去
          <el-button style="margin-left: 0;" type="text" @click="goLogin()">登录</el-button>
          <third-party-login></third-party-login>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import thirdPartyLogin from '../third_party_login.vue'
  export default {
    name   : 'register',
    data() {
      return {
        registerForm: {
          username: '',
          email   : '',
          password: ''
        }
      }
    },
    mounted: function () {

    },
    methods: {
      register(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let userInfo = {
              "username"  : this.registerForm.username,
              "password"  : this.registerForm.password,
              'email'     : this.registerForm.email
            };
            this.$http.post('/api/user/register', userInfo).then((res) => {
              if(res.data.success) {
                this.$message({
                  message: res.data.msg,
                  type   : 'success'
                });
                this.$http.get(`/api/user/${this.registerForm.email}`).then(response => {
                  localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                  this.$router.push('/');
                });
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            return false;
          }
        })
      },
      goLogin() {
        this.$router.push('/login');
      }
    },
    components: {
      thirdPartyLogin
    }
  }
</script>
<style scoped lang="stylus">
  .register {
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
          outline none;
        }
        a {
          cursor pointer
        }
        p {
          margin-top 0;
        }
      }
    }
  }

  @media (max-width: 768px)
    .register {
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
