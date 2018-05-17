<template>
  <div class="basicSetting">
    <navBar></navBar>
    <div class="basicInfo">
      <div>
        <div class="infoList row">
          <div class="col-4">
            <div class="avatar">
              <img :src="avatar" alt="头像">
            </div>
          </div>
          <div class="col-8">
            <div class="infoTitle changePic row align-items-center">
              <button type="button" class="btn btn-outline-success">
                <input type="file" @change="upLoad($event)">
                更改头像
              </button>
            </div>
          </div>
        </div>
        <div class="infoList row">
          <div class="infoTitle col-4">昵称</div>
          <div class="col-8">
            <input class="form-control" type="text" v-model="username" placeholder="请输入昵称">
          </div>
        </div>
        <div class="infoList row">
          <div class="infoTitle col-4">账号</div>
          <div class="col-8">
            <input class="form-control" type="text" v-model="phone" placeholder="请输入手机号">
          </div>
        </div>
        <div class="saveInfo row">
          <div class="col-4"></div>
          <div class="col-8 saveBtn">
            <button type="button" @click="save()" class="btn btn-success">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import navBar from './navBar.vue'

  export default {
    name      : 'basicSetting',
    data() {
      return {
        avatar  : '',
        username: '',
        phone   : ''
      }
    },
    mounted   : function () {
      this.initData();
    },
    methods   : {
      initData() {
        this.$http.get(`/api/getUserById/${localStorage.getItem('currentUserId')}`).then(res => {
          this.avatar = res.data.data.avatar;
          this.username = res.data.data.username;
          this.phone = res.data.data.phone;
        })
      },
      upLoad(e) {
        let that = this;
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          let result = e.target.result;
          that.changeImg(result);
        }
      },
      changeImg(result) {
        this.avatar = result;
      },
      save() {
        let data = {
          username: this.username,
          phone   : this.phone,
          avatar  : this.avatar
        }
        this.$http.put(`/api/updateUserInfo/${localStorage.getItem('currentUserId')}`, data).then(res => {
          if (res.data.success) {
            window.history.back();
          }
        })
      }
    },
    components: {
      navBar
    }
  }
</script>
<style scoped lang="stylus">
  .basicInfo
    width 640px
    margin 100px auto 0
    .saveInfo
      padding 0.75rem
      .saveBtn
        text-align left
      button
        padding-left 1rem
        padding-right 1rem
    .infoList
      padding 0.75rem
      border-bottom 1px solid #dee2e6
      width 100%
      text-align left
      .infoTitle
        text-align center
      .avatar
        width 100px
        height 100px
        margin auto
        img
          width 100%
          height 100%
          border-radius 50%
          border 1px solid #ddd
      .changePic
        width 100%
        height 100%
        padding-left 15px
        button
          position relative
          input
            position absolute
            left 15px
            width 100%
            opacity 0

  @media screen and (max-width: 786px)
    .basicInfo
      width 640px

  @media screen and (max-width: 480px)
    .basicInfo
      width 90% !important
</style>
