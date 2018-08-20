<template>
  <el-container class="is-vertical password">
    <top-nav v-if="type === 'reset'"></top-nav>
    <el-main>
      <div class="main" :class="{forget: type === 'forgot' ? true : false}">
        <h3>重置密码</h3>
        <el-form class="passForm" :model="passForm" ref="passForm">
          <el-form-item label=""
                        prop="email"
                        :rules="validate_rules({required: true, type: 'email'})">
            <el-input v-model="passForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label=""
                        v-if="type === 'reset'"
                        prop="password"
                        :rules="validate_rules({required: true, type: 'password'})">
            <el-input type="password" v-model="passForm.password" placeholder="请输入旧密码"></el-input>
          </el-form-item>
          <el-form-item label=""
                        v-if="type === 'reset' || hasChecked"
                        prop="newPass"
                        :rules="validate_rules({required: true, type: 'password'})">
            <el-input type="password" v-model="passForm.newPass" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label=""
                        v-if="type === 'reset' || hasChecked"
                        prop="passAgain"
                        :rules="validate_rules({required: true, type: 'passAgain'})">
            <el-input type="password" v-model="passForm.passAgain" placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <el-form-item label="" v-show="type === 'reset' || hasChecked">
            <el-button type="primary" style="width: 100%" @click="sure('passForm')">确定</el-button>
          </el-form-item>
          <el-form-item label="" v-show="type === 'forgot' && !hasChecked">
            <el-button type="primary" style="width: 100%" @click="goCheck('passForm')">去验证</el-button>
          </el-form-item>
          <el-form-item label="">
            <el-button style="width: 100%" @click="goBack()">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
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
        checkEmail   : this.$route.query.checkEmail,
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
      if (this.checkEmail) {
        this.hasChecked = true;
        this.passForm.email = this.checkEmail;
      } else {
        this.hasChecked = false;
      }
    },
    methods   : {
      goCheck(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$http.post('/api/user/sendMail', {email: this.passForm.email}).then(res => {
                this.$message.info('去邮箱验证');
              });
            } else {
              return false;
            }
        })
      },
      sure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updatePass(this.passForm);
            this.$router.push('/login');
            localStorage.clear();
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
      },
      goBack() {
        if (this.checkEmail) {
          this.$route.push('/login');
        } else {
          window.history.back();
        }
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
      .main {
        min-width 300px
        max-width 400px
        margin 60px auto 0
        padding 50px 50px 30px
        background-color #fff
        border-radius 4px
        box-shadow 0 0 8px rgba(0, 0, 0, .1)
        min-height 400px
        .passForm {
          width 80%
          margin 20px auto 0
        }
      }
    }
    /*.el-main.forget {
      margin-top 100px
    }*/
  }

  @media screen and (max-width: 786px)
    .password {
      .el-main {
        width 100%
        padding 0
        .main {
          min-width 300px
          max-width 400px
          margin 60px auto 0
          padding 50px 50px 30px
          background-color #fff
          border-radius 4px
          box-shadow 0 0 8px rgba(0, 0, 0, .1)
          h3 {
            fon-size 28px
            word-spacing 4px
          }
          .passForm {
            width 80%
          }
        }
      }
    }
</style>
