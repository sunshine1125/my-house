<template>
  <div>
    <div class="container">
      <div style="width: 50%; margin-left: 20%;">
        <el-form :model="resetForm" ref="resetForm" label-width="100px">
          <el-form-item label="邮箱"
                        prop="email"
                        :rules="validate_rules({required: true, type: 'email'})">
            <el-input v-model="resetForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="旧密码"
                        prop="oldPassword"
                        :rules="validate_rules({required: true, type: 'password'})">
            <el-input type="password" v-model="resetForm.oldPassword" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        prop="password"
                        :rules="validate_rules({required: true, type: 'password'})">
            <el-input type="password" v-model="resetForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码"
                        prop="passAgain"
                        :rules="validate_rules({required: true, type: 'passAgain'})">
            <el-input type="password" v-model="resetForm.passAgain" placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" style="width: 100%" @click="sure('resetForm')">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name       : 'forgotPassword',
    data() {
      return {
        resetForm  : {
          email      : '',
          oldPassword: '',
          password   : '',
          passAgain  : ''
        }
      }
    },
    mounted    : function () {
      this.resetForm.email = JSON.parse(localStorage.getItem('userInfo')).email;
    },
    methods    : {
      sure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let password = {
              'email'      : this.resetForm.email,
              'oldPassword': this.resetForm.oldPassword,
              'password'   : this.resetForm.password
            };
            this.$http.post('/api/singleUser', password).then(res => {
              if (res.data.success) {
                // 密码修改成功
                this.$message.success('密码修改成功');
                this.$http.put('/api/canChangePassword', password);
                this.$router.push('/login');
              } else {
                this.$message.error(res.data.message);
              }

            })
          } else {
            return false;
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
