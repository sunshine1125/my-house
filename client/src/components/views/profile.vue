<template>
  <div class="profile">
    <top-nav></top-nav>
    <el-main>
      <el-row class="container">
        <el-col :span="20">
          <el-row class="main-top">
            <a :href="`/u/${user.id}`" class="avatar">
              <img :src="user.avatar" alt="头像">
            </a>
            <el-row class="title">
              <a class="name" :href="`/u/${user.id}`">{{user.username}}</a>
            </el-row>
            <el-row class="info">
              <ul>

              </ul>
            </el-row>
          </el-row>
          <el-row class="trigger-menu">
            <el-row class="item active">
              <a v-if="currentActive">我的文章</a>
              <a v-else>我喜欢的文章</a>
            </el-row>
          </el-row>
          <el-row class="list-container">
            <ul class="note-list">
              <li v-for="p in posts" :class="{haveImg: haveImage(p.content)}">
                <a class="wrap-img">
                  <img v-if="haveImage(p.content)" :src="getImage(p.content)" alt="插图">
                </a>
                <div class="content">
                  <a :href="`/detail/${p.id}`" class="title">{{p.title}}</a>
                  <p class="abstract" v-html="getContent(p.content)"></p>
                </div>
                <div class="meta">
                  <span>
                    <i class="iconfont icon-comment"></i>
                    {{p.comment_num}}
                  </span>
                  <span>
                    <i class="iconfont icon-xihuan"></i>
                    {{p.like_num}}
                  </span>
                  <span class="time">{{getTime(p.create_at)}}</span>
                </div>
              </li>
            </ul>
          </el-row>
        </el-col>
        <el-col :offset="1" :span="3">
          <ul class="list">
            <li @click="getMyPosts()" :class="{active: currentActive}"><a><span>我的文章</span></a></li>
            <li @click="getMyLikePosts()" :class="{active: !currentActive}"><a><span>我喜欢的文章</span></a></li>
          </ul>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
  import topNav from '../topNav.vue'
  import removeMd from 'remove-markdown'

  export default {
    name      : 'profile',
    data() {
      return {
        currentUser  : JSON.parse(localStorage.getItem('currentUser')),
        posts        : [],
        currentActive: true,
        user         : {},
        userId       : this.$route.params.id
      }
    },
    mounted   : function () {
      this.getLookUser();
    },
    methods   : {
      getLookUser() {
        if (this.currentUser.id !== this.userId) {
          this.$http.get(`/api/user/get/${this.userId}`).then(res => {
            this.user = res.data.user;
            this.getCurrentUserPosts();
          })
        } else {
          this.user = this.currentUser;
          this.getCurrentUserPosts();
        }
      },
      getCurrentUserPosts() {
        this.$http.get(`/api/user/${this.user.id}/post`).then(res => {
          this.posts = res.data.data;
        })
      },
      getCurrentUserLikePosts() {
        this.$http.get(`/api/user/${this.user.id}/post_like`).then(res => {
          res.data.data.map(d => {
            this.posts.push(d.Post)
          })
        })
      },
      getContent(content) {
        return removeMd(content);
      },
      haveImage(content) {
        if (content.indexOf('<img') > -1) {
          return true;
        }
        return false;
      },
      getImage(content) {
        let src = null;
        let html = `<div id="getImage">${content}</div>`;
        $('body').append(html);
        let imgs = document.getElementById('getImage').querySelectorAll('img');
        src = imgs[0].getAttribute('src');
        $('#getImage').remove();
        return src;
      },
      getTime(time) {
        return this.$moment(time).format('YYYY.MM.DD HH:mm:ss')
      },
      getMyPosts() {
        this.posts = [];
        this.currentActive = true;
        this.getCurrentUserPosts();
      },
      getMyLikePosts() {
        this.posts = [];
        this.currentActive = false;
        this.getCurrentUserLikePosts();
      }
    },
    watch: {
      "$route" (to, from) {
        let index = to.path.lastIndexOf('/')
        let newVal = to.path.substr(index + 1);
        let oldVal = from.path.substr(index + 1)
        if (newVal !== oldVal) {
          this.userId = newVal;
          this.getLookUser();
        }
      }
    },
    components: {
      topNav
    }
  }
</script>
<style scoped lang="stylus">
  .profile {
    width 100%
    height 100%
    position relative
    padding-top 61px
    background #fff
    a {
      color #333
      cursor pointer
      text-decoration none
    }
    .el-row {
      text-align left
    }
    .el-header {
      position fixed
      top 0
      left 0
    }
    .el-main {
      margin 0 auto
      padding 0 15px
      .container {
        padding-top 15px
        margin 0 -15px
        .main-top {
          margin-bottom 20px
          .avatar {
            float left
            width 80px
            height 80px
            margin-left -2px
            display block
            cursor pointer
            img {
              width 100%
              height 100%
              border 1px solid #ddd
              border-radius 50%
            }
          }
          .title {
            padding 5px 0 0 100px
            .name {
              display inline
              font-size 21px
              font-weight 700
              vertical-align middle
            }
          }

          .info {
            margin-top 5px
            padding-left 100px
            font-size 14px
          }
        }
        .trigger-menu {
          margin-bottom 20px
          border-bottom 1px solid #f0f0f0
          .item {
            position relative
            display inline-block
            padding 8px 0
            margin-bottom -1px
            line-height 20px
            &.active {
              border-bottom 2px solid #646464
              a {
                color #646464
              }
            }
            a {
              padding 13px 20px
              font-size 15px
              font-weight 700
              color #969696
              line-height 25px
            }
          }
        }
        .list-container {
          .note-list {
            margin 0
            padding 0
            list-style none
            li {
              position relative
              width 100%
              margin 0 0 15px
              padding 15px 2px 20px 0
              border-bottom 1px solid #f0f0f0
              word-wrap break-word
              &.haveImg {
                min-height 140px
                .wrap-img {
                  position absolute
                  top 50%
                  margin-top -60px
                  right 0
                  width 125px
                  height 100px
                  img {
                    width 100%
                    height 100%
                    border-radius 4px
                    border 1px solid #f0f0f0
                  }
                }
                div {
                  padding-right 140px
                }
              }
              .content {
                .title {
                  margin -7px 0 4px
                  display inherit
                  font-size 18px
                  font-weight 700
                  line-height 1.5
                  color #333
                  &:visited {
                    color #969696
                  }
                }
                .abstract {
                  margin 0 0 8px
                  font-size 13px
                  line-height 24px
                  color #999
                  overflow hidden
                  -ms-text-overflow ellipsis
                  text-overflow ellipsis
                  display -webkit-box
                  -webkit-box-orient vertical
                  -webkit-line-clamp 2
                }
              }
              .meta {
                padding-right 0 !important
                font-size 12px
                font-weight 400
                line-height 20px
                span {
                  margin-right 10px
                  color #b4b4b4
                }
              }
            }
          }
        }
        .list {
          margin-bottom 16px
          padding-bottom 6px
          padding-left 0
          list-style none
          clear both
          li {
            margin-bottom 10px
            line-height 20px
            text-align left
            a {
              font-size 14px
              color #333
              line-height 30px
              display inline-block
              padding-left 10px
              span {
                vertical-align middle
              }
            }
            &.active {
              border-bottom 2px solid #409EFF
              a {
                color #409EFF
              }
            }
          }
        }
      }
    }
  }

  @media screen and (min-width: 768px)
    .profile {
      .el-main {
        width 750px
      }
    }

  @media screen and (min-width: 992px)
    .profile {
      .el-main {
        width 970px
      }
    }

  @media screen and (min-width: 1081px)
    .profile {
      .el-main {
        width 960px
      }
    }
</style>
