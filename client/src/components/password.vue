<template>
  <el-container class="is-vertical password">
    <top-nav v-if="type === 'reset'"></top-nav>
    <el-main :class="{forget: type === 'forgot' ? true : false}">
      <el-form class="passForm" :model="passForm" ref="passForm" label-width="100px">
        <el-form-item label="邮箱"
                      prop="email"
                      :rules="validate_rules({required: true, type: 'email'})">
          <el-input v-model="passForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="旧密码"
                      v-if="type === 'reset'"
                      prop="password"
                      :rules="validate_rules({required: true, type: 'password'})">
          <el-input type="password" v-model="passForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      v-if="type === 'reset' || hasChecked"
                      prop="newPass"
                      :rules="validate_rules({required: true, type: 'password'})">
          <el-input type="password" v-model="passForm.newPass" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码"
                      v-if="type === 'reset' || hasChecked"
                      prop="passAgain"
                      :rules="validate_rules({required: true, type: 'passAgain'})">
          <el-input type="password" v-model="passForm.passAgain" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="" v-show="type === 'forgot' && hasChecked">
          <el-button type="primary" style="width: 100%" @click="sure('passForm')">确定</el-button>
        </el-form-item>
        <el-form-item label="" v-show="type === 'forgot' && !hasChecked">
          <el-button type="primary" style="width: 100%" @click="goCheck()">去验证</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
  import topNav from './topNav.vue';

  export default {
    name      : 'forgotPassword',
    data() {
      return {
        type         : this.$route.params.type,
        currentUser  : JSON.parse(localStorage.getItem('currentUser')),
        passForm     : {
          email    : '',
          password : '',
          newPass  : '',
          passAgain: ''
        },
        hasChecked   : false
      }
    },
    mounted   : function () {
      if (this.currentUser) {
        this.passForm.email = this.currentUser.email;
      }
    },
    methods   : {
      goCheck() {
        this.$http.post('/api/user/sendMail', {email: this.passForm.email}).then(res => {
          this.$message.info('去邮箱验证');
        });
      },
      sure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updatePass(this.passForm);
            this.$router.push('/login');
          }
        })
      },
      updatePass(formData) {
        let requestUrl = '';
        if (this.type === 'reset') {
          requestUrl = `/api/user/${this.currentUser.id}/password/${this.type}`;
        } else {
          requestUrl = `/api/user/password/${this.type}`
        }
        this.$http.put(requestUrl, formData).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    components: {
      topNav
    }
  }
</script>
<style scoped lang="stylus">
  .password {
    width 100%
    height 100%
    .el-main {
      width 960px
      height 100%
      margin-left auto
      margin-right auto
      position relative
      padding 0
      .passForm {
        width 50%
        margin 20px auto 0
      }
    }
  }

  @media screen and (max-width: 786px)
    .password {
      .el-main {
        width 100%
        padding 0
        .passForm {
          width 80%
        }
      }
      .el-main.password {
        margin-top 100px
      }
    }
</style>
