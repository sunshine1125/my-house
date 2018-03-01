<template>
  <div>
    <div class="container">
      <div>
        <form>
          <div class="form-group row">
            <label for="useremail" class="col-sm-2 col-form-label">邮箱</label>
            <div class="col-sm-4">
              <input type="text" class="form-control" id="useremail" v-model="useremail" placeholder="请输入邮箱">
            </div>
          </div>
          <div class="form-group row">
            <label for="oldPassword" class="col-sm-2 col-form-label">旧密码</label>
            <div class="col-sm-4">
              <input type="password" class="form-control" id="oldPassword" v-model="oldPassword" placeholder="请输入旧密码">
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-2 col-form-label">密码</label>
            <div class="col-sm-4">
              <input type="password" class="form-control" id="inputPassword" v-model="password" placeholder="请设置新密码">
            </div>
          </div>
          <div class="form-group row">
            <label for="password" class="col-sm-2 col-form-label">确认密码</label>
            <div class="col-sm-4">
              <input type="password" class="form-control" id="password" v-model="passAgain" placeholder="请再次输入新密码">
            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-2"></div>
            <div class="col-sm-2">
              <button class="btn btn-primary btn-block" type="button" @click="sure()">确定</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import swal from 'sweetalert2'

  export default {
    name   : 'forgotPassword',
    data() {
      return {
        useremail  : '',
        oldPassword: '',
        password   : '',
        passAgain  : ''
      }
    },
    mounted: function () {
      this.useremail = JSON.parse(localStorage.getItem('username')).username;
    },
    methods: {
      sure() {
        if (this.password === this.passAgain) {
          let password = {
            'email'      : this.useremail,
            'oldPassword': this.oldPassword,
            'password'   : this.password
          };
          this.$http.post('/api/singleUser', password).then(res => {
            console.log(res.data);
            if(res.data.success) {
              // 密码修改成功
              this.$http.put('/api/canChangePassword', password);
              this.$router.push('/login');
            } else {
              swal(res.data.message);
            }

          })

        } else {
          swal("两次输入密码应一致！");

        }
      }
    }
  }
</script>
<style scoped>
  .container {
    margin-top: 100px;
  }
</style>
