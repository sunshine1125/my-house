<template>
  <div>
    <div class="container">
      <div style="width: 50%; margin-left: 20%;">
        <el-form :model="forgotForm" ref="forgotForm" label-width="100px">
          <el-form-item label="邮箱"
                        prop="email"
                        :rules="validate_rules({required: true, type: 'email'})">
            <el-input v-model="forgotForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="" v-show="hasChecked">
            <el-button type="primary" style="width: 100%" @click="goCheck('forgotForm')">去验证</el-button>
          </el-form-item>
        </el-form>
        <el-form v-show="!hasChecked" :model="resetPassForm" ref="resetPassForm" label-width="100px">
          <el-form-item label="密码"
                        prop="password"
                        :rules="validate_rules({required: true, type: 'password'})">
            <el-input type="password" v-model="resetPassForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码"
                        prop="passAgain"
                        :rules="validate_rules({required: true, type: 'passAgain'})">
            <el-input type="password" v-model="resetPassForm.passAgain" placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" style="width: 100%" @click="sure('resetPassForm')">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name   : 'forgotPassword',
    data() {
      return {
        forgotForm: {
          email : ''
        },
        resetPassForm: {
          password  : '',
          passAgain : ''
        },
        hasChecked: true
      }
    },
    mounted: function () {
      if (localStorage.getItem('email')) {
        this.forgotForm.email = JSON.parse(localStorage.getItem('email')).email;
        if (this.hasChecked) {
          this.$http.get(`/api/canChangePassword/${JSON.parse(localStorage.getItem('email')).email}`).then(res => {
            if (res.data.success) {
              this.hasChecked = false;
            } else {
              this.$message(res.data.message);
            }
          })
        }
      }
    },
    methods: {
      goCheck(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let userMail = {
              "email": this.forgotForm.email
            };
            this.$http.post('/api/forgotPassword', userMail).then(res => {
            });
            this.$message.info('去邮箱验证');
            localStorage.setItem("email", JSON.stringify(userMail));
          } else {
            return false;
          }
        })
      },
      sure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let password = {
              'email'   : this.forgotForm.email,
              'password': this.resetPassForm.password
            };
            this.$http.post('/api/singleUser', password).then(res => {
              // 密码修改成功
              this.$http.put('/api/canChangePassword', password);
              this.$message.success('重置密码成功');
              this.$router.push('/admin/login');
              localStorage.removeItem('email');
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  .container {
    margin-top: 100px;
  }
</style>
