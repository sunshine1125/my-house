<template>
  <el-form ref="form" :label-position="labelPosition" :model="form" label-width="100px">
    <el-form-item label="用户名" prop="userName" :rules="validate_rules({required: true, min: 3, max: 5})">
      <el-input v-model="form.userName"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password" :rules="validate_rules({required: true, type: 'password'})">
      <el-input v-model="form.password" type="password"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="passAgain" :rules="validate_rules({required: true, type: 'passAgain'})">
      <el-input v-model="form.passAgain" type="password"></el-input>
    </el-form-item>
    <el-form-item label="用户类型" prop="userType" :rules="validate_rules({required: true})">
      <el-select v-model="form.userType" placeholder="请选择用户类型">
        <el-option value="管理员"></el-option>
        <el-option value="普通用户"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="邮箱" prop="email" :rules="validate_rules({required: true, type: 'email'})">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" prop="phone" :rules="validate_rules({type: 'phone'})">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save('form')">保存</el-button>
      <el-button type="info" @click="cancel()">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

  export default {
    name    : 'userDialog',
    props   : ['formVisible'],
    data() {
      return {
        labelPosition: 'right',
        isCloseForm  : this.formVisible,
        form         : {
          userName : '',
          password : '',
          passAgain: '',
          userType : '',
          email    : '',
          phone    : ''
        }
      }
    },
    computed: {},
    methods : {
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var userTypeId = null;
            if (this.form.userType === '管理员') {
              userTypeId = 0;
            } else {
              userTypeId = 1;
            }
            var userInfo = {
              'userName'  : this.form.username,
              'password'  : this.form.password,
              'userTypeId': userTypeId,
              'userType'  : this.form.userType,
              'phone'     : this.form.phone
            }
            this.isCloseForm = false;
            this.$emit('isCloseForm', this.isCloseForm);
            this.$http.post('/api/register', userInfo);
          } else {
            return false;
          }
        })
      },
      cancel() {
        this.isCloseForm = false;
        this.$emit('isCloseForm', this.isCloseForm);
      }
    }
  }
</script>
<style scoped>

</style>
