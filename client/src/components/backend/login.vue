<template>
  <div class="login container">
    <h3>登录</h3>
    <el-form :model="loginForm" ref="loginForm" label-width="100px">
      <el-form-item label="邮箱"
                    prop="email"
                    :rules="validate_rules({required: true, type: 'email'})">
        <el-input v-model="loginForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码"
                    prop="password"
                    :rules="validate_rules({required: true, type: 'password'})">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" style="width: 100%" @click="login('loginForm')">登录</el-button>
        还没有账号，快去
        <el-button style="margin-left: 0;" type="text" @click="goRegister()">创建</el-button>
        一个吧！
        <p style="cursor: pointer" @click="forgotPassword()">忘记密码？</p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
      if (this.$route.query == null) {

      } else {
        if (this.$route.query.passedCheck) {
          this.$message({
            message: '邮箱验证成功，请登录!',
            type   : 'success'
          })
        }
      }
    },
    methods: {
      login(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let userInfo = {
              "email"   : this.loginForm.email,
              "password": this.loginForm.password
            };
            let that = this;
            this.$http.post('/api/authentication', userInfo)
              .then((res) => {
                if (res.data.success) {
                  if (res.data.token) {
                    let userInfo = {
                      'email': this.loginForm.email,
                      '_id'  : res.data._id,
                      'token': res.data.token,
                      'roleId': res.data.roleId
                    };
                    this.$message({
                      message: res.data.message,
                      type   : 'success'
                    });
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    that.$router.push('/admin');
                  }
                } else {
                  if (!res.data.check) {
                    this.$confirm(res.data.message, '提示', {
                      confirmButtonText: '去验证',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      let email = {
                        "email": this.useremail
                      };
                      this.$http.post('/api/sendEmail', email).then(res => {
                        this.$router.push('/admin/checkEmail');
                      });
                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消验证'
                      })
                    })
                  } else {
                    this.$message.error(res.data.message);
                  }
                }
              })
          } else {
            return false;
          }
        })
      },
      goRegister() {
        this.$router.push('/admin/register');
      },
      forgotPassword() {
        this.$router.push('/admin/forgotPassword');
      }
    }
  }
</script>
<style scoped lang="stylus">
  .login {
    width: 30%;
    margin: auto;
    background: #eee;
    padding-top: 40px;
    padding-bottom: 20px;
    margin-top: 150px;
  }

  form {
    width: 80%;
    margin-top: 30px;
    margin-left: 30px;
  }

  input, button {
    outline: none;
  }

  a {
    cursor: pointer
  }

</style>
