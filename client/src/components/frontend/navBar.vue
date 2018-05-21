<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light fixed-top">
      <a class="navbar-brand" href="#/">小屋</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item" v-if="!hasLogin">
            <a class="nav-link" href="#/login">登录</a>
          </li>
          <li class="nav-item" v-if="!hasLogin">
            <a class="nav-link" href="#/register">注册</a>
          </li>
          <li class="pic nav-item dropdown" v-if="hasLogin">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false">
              <img :src="imgSrc" width="40" height="40" alt="">
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
              <a class="dropdown-item" href="#/login" @click="logout()">退出</a>
              <a class="dropdown-item" href="#/basicSetting">设置</a>
              <a href="javascript: viod(0)" class="dropdown-item" data-toggle="modal" data-target=".bd-example-modal-lg">分享</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
    <!--Modal-->
    <div class="modal fade bd-example-modal-lg" id="shareModal" tabindex="-1" role="dialog" aria-labelledby="shareModal"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">分享到：</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <social-sharing :url="shareUrl"
                            title="来自小屋的分享"
                            inline-template>
              <div>
                <ul class="list-group networks">
                  <li style="cursor: pointer" class="list-group-item" data-dismiss="modal">
                    <network network="facebook">
                      <i class="fa fa-fw fa-facebook"></i> Facebook
                    </network>
                  </li>
                  <li style="cursor: pointer" class="list-group-item" data-dismiss="modal">
                    <network network="googleplus">
                      <i class="fa fa-fw fa-google-plus"></i> Google +
                    </network>
                  </li>
                  <li style="cursor: pointer" class="list-group-item" data-dismiss="modal">
                    <network network="linkedin">
                      <i class="fa fa-fw fa-linkedin"></i> LinkedIn
                    </network>
                  </li>
                  <li style="cursor: pointer" class="list-group-item" data-dismiss="modal">
                    <network network="pinterest">
                      <i class="fa fa-fw fa-pinterest"></i> Pinterest
                    </network>
                  </li>
                  <li style="cursor: pointer" class="list-group-item" data-dismiss="modal">
                    <network network="reddit">
                      <i class="fa fa-fw fa-reddit"></i> Reddit
                    </network>
                  </li>
                  <li style="cursor: pointer" class="list-group-item" data-dismiss="modal">
                    <network network="twitter">
                      <i class="fa fa-fw fa-twitter"></i> Twitter
                    </network>
                  </li>
                  <li style="cursor: pointer" class="list-group-item" data-dismiss="modal">
                    <network network="vk">
                      <i class="fa fa-vk"></i> VKontakte
                    </network>
                  </li>
                  <li style="cursor: pointer" class="list-group-item" data-dismiss="modal">
                    <network network="weibo">
                      <i class="fa fa-weibo"></i> Weibo
                    </network>
                  </li>
                  <li style="cursor: pointer" class="list-group-item" data-dismiss="modal">
                    <network network="whatsapp">
                      <i class="fa fa-fw fa-whatsapp"></i> Whatsapp
                    </network>
                  </li>
                </ul>
              </div>
            </social-sharing>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name      : 'navBar',
    props     : ['type', 'shareUrl'],
    data() {
      return {
        currentUserName: '',
        hasLogin       : false,
        imgSrc         : ''
      }
    },
    mounted   : function () {
      if (localStorage.getItem('currentUserId')) {
        this.hasLogin = true;
        if (JSON.parse(localStorage.getItem('userInfo')).roleId === 1) {
          this.getAdminUserName(localStorage.getItem(('currentUserId')));
        } else if (JSON.parse(localStorage.getItem('userInfo')).roleId === 3) {
          this.getUserName(localStorage.getItem(('currentUserId')));
        }
      } else {
        this.hasLogin = false;
      }
    },
    computed  : {},
    methods   : {
      getUserName(id) {
        this.$http.get(`/api/getUserById/${id}`).then(res => {
          this.processUserInfo(res);
        })
      },
      getAdminUserName(id) {
        this.$http.get(`/api/getSingleUserById/${id}`).then(res => {
          this.processUserInfo(res);
        })
      },
      processUserInfo(res) {
        this.currentUserName = res.data.data.username;
        this.imgSrc = res.data.data.avatar;
        let userInfo = {
          currentUserName: this.currentUserName,
          avatar         : this.imgSrc
        }
        localStorage.setItem('currentUserInfo', JSON.stringify(userInfo));
      },
      logout() {
        localStorage.clear();
      }
    },
    components: {}
  }
</script>
<style scoped lang="stylus">
  .navbar
    border-bottom 1px solid #e0e0e0
    width 100%
    z-index 100
    background-color #f5f5f5
    .pic
      .nav-link
        padding 0 0.5rem
      img
        border-radius 50%

</style>
