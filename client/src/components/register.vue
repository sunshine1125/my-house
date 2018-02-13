<template>
  <div class="register container">
    <h2>注册</h2>
    <form>
      <div class="form-group row">
        <label for="username" class="col-sm-2 col-form-label">用户名</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" id="username" v-model="username" placeholder="请填写用户名">
        </div>
      </div>
      <div class="form-group row">
        <label for="inputPassword" class="col-sm-2 col-form-label">密码</label>
        <div class="col-sm-8">
          <input type="password" class="form-control" id="inputPassword" v-model="password" placeholder="请设置密码">
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-2"></div>
        <div class="col-sm-8">
          <button class="btn btn-primary btn-block" type="button" @click="register()">注册</button>
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
        username: '',
        password: ''
      }
    },
    methods: {
      register() {
        if (this.username && this.password) {
          let userInfo = {
            "username": this.username,
            "password": this.password
          };
          this.$http.post('/api/register', userInfo)
            .then((res) => {
              if(res.data.success) {
                if (res.data.token) {
                  let userInfo = {
                    'username': this.username,
                    'token'   : res.data.token
                  };
                  localStorage.setItem('username', JSON.stringify(userInfo));
                  this.$router.push('/');
                }
              } else {
                swal(res.data.message);
              }

            })
        } else {
          swal('用户名和密码都不能为空！')
        }
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
