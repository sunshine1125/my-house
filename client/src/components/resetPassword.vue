<template>
  <div>
    <div class="container">
      <div>
        <form>
          <div class="form-group row" v-bind:class="{ 'form-group--error': $v.useremail.$error }">
            <label for="useremail" class="col-sm-2 col-form-label form__label">邮箱</label>
            <div class="col-sm-4">
              <input type="text" class="form-control form__input" id="useremail" v-model="useremail" @input="$v.useremail.$touch()" placeholder="请输入邮箱">
            </div>
            <span class="form-group__message change__message" v-if="!$v.useremail.required">邮箱不能为空</span>
            <span class="form-group__message change__message" v-if="!$v.useremail.email">请填写格式正确的邮箱</span>
          </div>
          <div class="form-group row" v-bind:class="{ 'form-group--error': $v.oldPassword.$error }">
            <label for="oldPassword" class="col-sm-2 col-form-label form__label">旧密码</label>
            <div class="col-sm-4">
              <input type="password" class="form-control form__input" id="oldPassword" v-model="oldPassword" @input="$v.oldPassword.$touch()" placeholder="请输入旧密码">
            </div>
            <span class="form-group__message change__message" v-if="!$v.oldPassword.required">密码不能为空</span>
          </div>
          <div class="form-group row" v-bind:class="{ 'form-group--error': $v.password.$error }">
            <label for="inputPassword" class="col-sm-2 col-form-label form__label">密码</label>
            <div class="col-sm-4">
              <input type="password" class="form-control form__input" id="inputPassword" v-model="password" @input="$v.password.$touch()" placeholder="请设置新密码">
            </div>
            <span class="form-group__message change__message" v-if="!$v.password.required">密码不能为空</span>
            <span class="form-group__message change__message" v-if="!$v.password.minLength">密码长度不少于4个字符</span>
          </div>
          <div class="form-group row" v-bind:class="{ 'form-group--error': $v.passAgain.$error }">
            <label for="password" class="col-sm-2 col-form-label form__label">确认密码</label>
            <div class="col-sm-4">
              <input type="password" class="form-control form__input" id="password" v-model="passAgain" @input="$v.passAgain.$touch()" placeholder="请再次输入新密码">
            </div>
            <span class="form-group__message change__message" v-if="!$v.passAgain.required">密码不能为空</span>
            <span class="form-group__message change__message" v-if="!$v.passAgain.minLength">两次输入密码应一致</span>
          </div>
          <div class="form-group row">
            <div class="col-sm-2"></div>
            <div class="col-sm-2">
              <button :disabled="$v.validationGroup.$error || $v.validationGroup.$invalid"  class="btn btn-primary btn-block" type="button" @click="sure()">确定</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import swal from 'sweetalert2'
  import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

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
    validations: {
      useremail: {
        required, email
      },
      oldPassword: {
        required
      },
      password: {
        required,
        minLength: minLength(4)
      },
      passAgain: {
        required,
        sameAsPassword: sameAs('password')
      },
      validationGroup: ['useremail', 'oldPassword', 'password', 'passAgain']
    },
    mounted: function () {
      this.useremail = JSON.parse(localStorage.getItem('username')).username;
    },
    methods: {
      sure() {
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
      }
    }
  }
</script>
<style scoped>
  .container {
    margin-top: 100px;
  }
</style>
