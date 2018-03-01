<template>
  <div class="login container">
    <h5 v-show="isChecked">邮箱验证成功，请登录</h5>
    <h2>登录</h2>
    <form>
      <div class="form-group row">
        <label for="useremail" class="col-sm-2 col-form-label">用户名</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" id="useremail" v-model="useremail" placeholder="请输入邮箱">
        </div>
      </div>
      <div class="form-group row">
        <label for="inputPassword" class="col-sm-2 col-form-label">密码</label>
        <div class="col-sm-8">
          <input type="password" class="form-control" id="inputPassword" v-model="password" placeholder="请输入密码">
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-2"></div>
        <div class="col-sm-8">
          <button class="btn btn-primary btn-block" type="button" @click="login()">登录</button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-2"></div>
        <div class="col-sm-8">
          还没有账号，快去<a href="/#/register">创建</a>一个吧！
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-2"></div>
        <div class="col-sm-8">
          <a @click="forgotPassword()">忘记密码？</a>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import swal from 'sweetalert2'

  export default {
    name   : 'login',
    data() {
      return {
        useremail: '',
        password : '',
        isChecked: false
      }
    },
    mounted: function () {
      if(this.$route.query == null) {
        this.isChecked = false;
      } else {
        if (this.$route.query.passedCheck) {
          this.isChecked = true;
        }
      }

    },
    methods: {
      login() {
        if (this.useremail && this.password) {
          let userInfo = {
            "username": this.useremail,
            "password": this.password
          };
          this.$http.post('/api/authentication', userInfo)
            .then((res) => {
              if (res.data.success) {
                if (res.data.token) {
                  let userInfo = {
                    'username': this.useremail,
                    'token'   : res.data.token
                  };
                  localStorage.setItem('username', JSON.stringify(userInfo));
                  this.$router.push('/');
                }
                swal(res.data.message);
              } else {
                if (!res.data.check) {
                  swal({
                    title            : res.data.message,
                    type             : 'warning',
                    confirmButtonText: '去验证',
                  }).then((result) => {
                    let email = {
                      "email": this.useremail
                    };
                    this.$http.post('/api/sendEmail', email).then(res => {
                      this.$router.push('/checkEmail');
                    });
                  });
                } else {
                  swal(res.data.message);
                }
              }
            })
        } else {
          swal('用户名和密码都不能为空！')
        }
      },
      forgotPassword() {
        this.$router.push('/forgotPassword');
      }
    }
  }
</script>
<style scoped>
  .login {
    width: 35%;
    /*height: 300px;*/
    margin: auto;
    background: #eee;
    padding-top: 20px;
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
  h5 {
    margin-bottom: 20px;
  }
</style>
