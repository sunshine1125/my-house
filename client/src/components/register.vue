<template>
  <div class="register container">
    <h2>注册</h2>
    <form>
      <div class="form-group row">
        <label for="username" class="col-sm-3 col-form-label">用户名</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" id="username" v-model="username" placeholder="请填写用户名">
        </div>
      </div>
      <div class="form-group row">
        <label for="email" class="col-sm-3 col-form-label">邮箱</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" id="email" v-model="mail" placeholder="请填写邮箱">
        </div>
      </div>
      <div class="form-group row">
        <label for="inputPassword" class="col-sm-3 col-form-label">密码</label>
        <div class="col-sm-8">
          <input type="password" class="form-control" id="inputPassword" v-model="password" placeholder="请设置密码">
        </div>
      </div>
      <div class="form-group row">
        <label for="password" class="col-sm-3 col-form-label">确认密码</label>
        <div class="col-sm-8">
          <input type="password" class="form-control" id="password" v-model="passAgain" placeholder="请再次输入密码">
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-3"></div>
        <div class="col-sm-8">
          <button class="btn btn-primary btn-block" type="button" @click="register()">注册</button>
          <!--<button class="btn btn-primary btn-block" type="button" @click="goCheck()">去邮箱验证</button>-->
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import swal from 'sweetalert2'

  export default {
    name   : 'register',
    data() {
      return {
        username : '',
        password : '',
        mail     : '',
        passAgain: ''
      }
    },
    methods: {
      register() {
        if (this.username && this.password && this.mail && this.passAgain) {
          let userInfo = {
            "username": this.username,
            "password": this.password
          };
          this.$http.post('/api/register', userInfo)
            .then((res) => {
              if (res.data.success) {
                if (res.data.token) {
                  let userInfo = {
                    'username': this.username,
                    'token'   : res.data.token,
                    'email'   : this.mail,
                  };
                  localStorage.setItem('username', JSON.stringify(userInfo));
                  this.$http.get('/api/sendEmail');
                  this.$router.push('/checkEmail');
//                  this.$router.push('/');
                }
              } else {
                swal(res.data.message);
              }

            })
        } else {
          swal('用户名,邮箱和密码都不能为空！')
        }
      },
      goCheck() {

      }
    }
  }
</script>
<style scoped>
  .register {
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
</style>
