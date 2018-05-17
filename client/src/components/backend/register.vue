<template>
  <div class="register container">
    <h3>注册</h3>
    <img v-show="false" id="avatar" width="100" height="100" src="../../assets/default.jpg" alt="">
    <el-form :model="registerForm" ref="registerForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名"
                    prop="username"
                    :rules="validate_rules({required: true, min: 3, max: 10})">
        <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱"
                    prop="email"
                    :rules="validate_rules({required: true, type: 'email'})">
        <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码"
                    prop="password"
                    :rules="validate_rules({required: true, type: 'password'})">
        <el-input type="password" v-model="registerForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码"
                    prop="passAgain"
                    :rules="validate_rules({required: true, type: 'passAgain'})">
        <el-input type="password" v-model="registerForm.passAgain" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" style="width: 100%" @click="register('registerForm')">注册</el-button>
        已有账号，去
        <el-button style="margin-left: 0;" type="text" @click="goLogin()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name   : 'register',
    data() {
      return {
        registerForm: {
          username : '',
          password : '',
          email    : '',
          passAgain: ''
        },
      }
    },
    methods: {
      register(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let userInfo = {
              "username"  : this.registerForm.username,
              "password"  : this.registerForm.password,
              'email'     : this.registerForm.email,
              'userTypeId': 1,
              'avatar'    : document.getElementById('avatar').getAttribute('src')
            };
            this.$http.post('/api/register', userInfo)
              .then((res) => {
                if (res.data.success) {
                  let email = {
                    "email": this.registerForm.email
                  };
                  this.$message({
                    message: res.data.message,
                    type   : 'success'
                  });
                  this.$http.post('/api/sendEmail', email).then(res => {
                    this.$router.push('/admin/checkEmail');
                  });
                } else {
                  this.$message.error(res.data.message);
                }
              })
          } else {
            return false;
          }
        });
      },
      goLogin() {
        this.$router.push('/admin/login');
      }
    }
  }
</script>
<style scoped lang="stylus">
  .register {
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
    outline: none
  }

  a {
    cursor: pointer
  }

</style>
