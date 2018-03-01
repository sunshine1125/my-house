<template>
  <div>
    <div class="container">
      <div>
        <form v-show="isCheck">
          <div class="form-group row">
            <label for="useremail" class="col-sm-2 col-form-label">邮箱</label>
            <div class="col-sm-4">
              <input type="text" class="form-control" id="useremail" v-model="useremail" placeholder="请输入邮箱">
            </div>
          </div>
          <div class="form-group row" v-show="hasChecked">
            <div class="col-sm-2"></div>
            <div class="col-sm-2">
              <button class="btn btn-primary btn-block" type="button" @click="goCheck()">去验证</button>
            </div>
          </div>
        </form>
        <div v-show="!isCheck">
          <h2>去邮箱验证</h2>
        </div>
        <form action="" v-show="!hasChecked && isCheck">
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-2 col-form-label">密码</label>
            <div class="col-sm-4">
              <input type="password" class="form-control" id="inputPassword" v-model="password" placeholder="请设置密码">
            </div>
          </div>
          <div class="form-group row">
            <label for="password" class="col-sm-2 col-form-label">确认密码</label>
            <div class="col-sm-4">
              <input type="password" class="form-control" id="password" v-model="passAgain" placeholder="请再次输入密码">
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
        useremail : '',
        isCheck   : true,
        password  : '',
        passAgain : '',
        hasChecked: true
      }
    },
    mounted: function () {
      if (localStorage.getItem('email')) {
        this.useremail = JSON.parse(localStorage.getItem('email')).email;
        if (this.hasChecked) {
          this.$http.get('/api/canChangePassword/' + JSON.parse(localStorage.getItem('email')).email).then(res => {
            if (res.data.success) {
              this.hasChecked = false;
            } else {
              swal(res.data.message);
            }
          })
        }
      }
    },
    methods: {
      goCheck() {
        if (this.useremail) {
          let userMail = {
            "email": this.useremail
          };
          this.$http.post('/api/forgotPassword', userMail).then(res => {
            this.isCheck = false;
            localStorage.setItem("email", JSON.stringify(userMail));
          })
        } else {
          swal('请输入邮箱！')
        }

      },
      sure() {
        if (this.password === this.passAgain) {
          let password = {
            'email'   : this.useremail,
            'password': this.password
          };
          this.$http.post('/api/singleUser', password).then(res => {
            // 密码修改成功
            this.$http.put('/api/canChangePassword', password);
            this.$router.push('/login');
            localStorage.removeItem('email');
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
