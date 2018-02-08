<template>
  <div class="login container">
    <h2>登录</h2>
    <form>
      <div class="form-group row">
        <label for="username" class="col-sm-2 col-form-label">用户名</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" id="username" v-model="username" placeholder="请输入用户名">
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
    </form>
  </div>
</template>

<script>
  export default {
    name   : 'login',
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      login() {
        this.$http.get('/api/login/getAccount')
          .then(function (res) {
            let userInfo = {
              "username": this.username,
              "password": this.password
            };
            return this.$http.post('/api/login/createAccount', userInfo);
          })
          .then(function (res) {
            console.log(res);
          })
          .catch(function (reject) {
            console.log(reject);
          })
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
