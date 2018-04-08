<template>
  <div class="register container">
    <h3>注册</h3>
    <el-form :model="registerForm" ref="registerForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="registerForm.mail"
                  placeholder="请输入邮箱"
        :rules="validate_rules({required: true})">
        </el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registerForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="passAgain">
        <el-input v-model="registerForm.passAgain" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" style="width: 100%" @click="register('registerForm')">注册</el-button>
        已有账号，去<el-button style="margin-left: 0;" type="text" @click="goLogin()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import swal from 'sweetalert2'
  import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

  export default {
    name   : 'register',
    data() {
      return {
        registerForm: {
          username : '',
          password : '',
          mail     : '',
          passAgain: ''
        },
//        registerRules : {
//          username: [
//            {required: true, message: '请输入用户名', trigger: 'blur'}
//          ],
//          mail   : [
//            {required: true, message: '请输入邮箱', trigger: 'blur'}
//          ],
//          password: [
//            {required: true, message: '请输入密码', trigger: 'blur'}
//          ],
//          passAgain: [
//            {required: true, message: '请再次输入密码', trigger: 'blur'}
//          ]
//        }
      }
    },
    methods: {
      register(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let userInfo = {
              "username": this.registerForm.username,
              "password": this.registerForm.password,
              'email'   : this.registerForm.mail
            };
            this.$http.post('/api/register', userInfo)
              .then((res) => {
                if (res.data.success) {
                  let email = {
                    "email": this.registerForm.mail
                  };
                  this.$message({
                    message: res.data.message,
                    type: 'success'
                  });
                  this.$http.post('/api/sendEmail', email).then(res => {
                    this.$router.push('/checkEmail');
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
        this.$router.push('/login');
      }
    }
  }
</script>
<style scoped>
  .register {
    /*padding: 40px;*/
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
