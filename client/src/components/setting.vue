<template>
  <div class="setting">
    <top-nav></top-nav>
    <el-main>
      <div class="basicInfo">
        <div>
          <div class="infoList row">
            <div class="col-4">
              <div class="avatar">
                <img :src="userInfo.avatar" alt="头像">
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
              <input class="form-control" type="text" v-model="userInfo.username" placeholder="请输入昵称">
            </div>
          </div>
          <div class="infoList row">
            <div class="infoTitle col-4">账号</div>
            <div class="col-8">
              <input class="form-control" type="text" v-model="userInfo.phone" placeholder="请输入手机号">
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
    </el-main>
  </div>
</template>

<script>
  import topNav from './topNav.vue'
  export default {
    name      : 'basicSetting',
    data() {
      return {
        userInfo: JSON.parse(localStorage.getItem('currentUser'))
      }
    },
    mounted   : function () {

    },
    methods   : {
      upLoad(e) {
        let file = e.target.files[0];
        let fd = new FormData();
        fd.append('file', file);
        this.$http.post('/api/upload', fd, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res.data.success) {
            this.userInfo.avatar = res.data.path;
            this.$message({
              message: res.data.msg,
              type   : 'success'
            });
          }

        });
      },
      save() {
        this.$http.put(`/api/user/${this.userInfo.id}`, this.userInfo).then(res => {
          if (res.data.success) {
            this.$message({
              message: res.data.msg,
              type   : 'success'
            });
            localStorage.setItem('currentUser', JSON.stringify(this.userInfo));
          }
        })
      }
    },
    components: {
      topNav
    }
  }
</script>
<style scoped lang="stylus">
  .setting {
    width 100%
    height 100%
    position relative
    .el-header {
      position fixed
      top 0
      left 0
    }
    .el-main {
      width 960px
      height 100%
      margin-left auto
      margin-right auto
      margin-top 60px
      position relative
      overflow visible
      .basicInfo {
        margin auto
        .saveInfo {
          padding 0.75rem
        }
        .saveBtn {
          text-align left
        }
        button {
          padding-left 1rem
          padding-right 1rem
        }
        .infoList {
          padding 0.75rem
          border-bottom 1px solid #dee2e6
          width 100%
          text-align left
          .infoTitle {
            text-align center
          }
          .avatar {
            width 100px
            height 100px
            margin auto
            img {
              width 100%
              height 100%
              border-radius 50%
              border 1px solid #ddd
            }
          }
          .changePic {
            width 100%
            height 100%
            padding-left 15px
            button {
              position relative
            }
            input {
              position absolute
              left 15px
              width 100%
              opacity 0
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 786px)
    .setting {
      .el-main {
        width 100%
        padding 0
      }
    }
</style>
