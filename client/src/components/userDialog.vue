<template>
  <el-form ref="form" :label-position="labelPosition" :model="form" label-width="100px">
    <el-form-item label="用户名" prop="userName" :rules="validate_rules({required: true, min: 3, max: 5})">
      <el-input v-model="form.userName"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password" :rules="validate_rules({required: true, type: 'password'})">
      <el-input v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="passAgain" :rules="validate_rules({required: true, type: 'passAgain'})">
      <el-input v-model="form.passAgain"></el-input>
    </el-form-item>
    <el-form-item label="用户类型" prop="userType">
      <el-select v-model="form.userType" placeholder="请选择用户类型" :rules="validate_rules({required: true})">
        <el-option value="管理员"></el-option>
        <el-option value="普通用户"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="邮箱" prop="email" :rules="validate_rules({required: true, type: 'email'})">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" prop="phone" :rules="validate_rules({required: true, type: 'phone'})">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save('form')">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

  export default {
    name   : 'userDialog',
    data() {
      return {
        labelPosition: 'right',
        form         : {
          userName : '',
          password : '',
          passAgain: '',
          userType : '',
          email    : '',
          phone    : ''
        },
//        formRules    : {
//          userName: [
//            {required: true, message: '请输入用户名', trigger: 'blur'}
//          ],
//          password: [
//            {required: true, message: '请输入密码', trigger: 'blur'}
//          ],
//          againpass: [
//            {required: true, message: '请再次输入密码', trigger: 'blur'}
//          ],
//          userType: [
//            {required: true, message: '请选择用户类型', trigger: 'change'}
//          ],
//          email   : [
//            {required: true, message: '请输入邮箱', trigger: 'blur'}
//          ],
//          phone   : [
//            {required: true, message: '请输入联系方式', trigger: 'blur'}
//          ]
//        }

      }
    },
    mounted: function () {

    },
    methods: {
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('TODO')
          } else {
            return false;
          }
        })
      }
    }
  }
</script>
<style scoped>

</style>
