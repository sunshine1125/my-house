<template>
  <div class="follow">
    <top-nav></top-nav>
    <el-main>
      <el-row class="container">
        <el-col :span="20">
          <el-row class="trigger-menu">
            <el-row class="item active">
              <a>关注列表</a>
            </el-row>
          </el-row>
          <el-row class="list-container">
            <el-row class="note-list">
              <el-row v-for="f in followers" class="list">
                <el-col :span="2">
                  <a :href="`/u/${f.follow_id}`" class="avatar">
                    <img :src="f.follow.avatar" alt="头像">
                  </a>
                </el-col>
                <el-col :span="14" class="title">
                  <a :href="`/u/${f.follow_id}`" class="name">{{f.follow.username}}</a>
                </el-col>
                <el-col class="btn-hollow" :span="8">
                  <el-button type="success" round plain @click="sendMsg(f.follow_id)">发私信</el-button>
                  <el-button type="success" round plain @click="goProfile(f.follow_id)">个人主页 > </el-button>
                </el-col>
              </el-row>
            </el-row>
          </el-row>
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
        followers    : []
      }
    },
    mounted   : function () {
      this.getCurrentUserFollowers();
    },
    methods   : {
      getCurrentUserFollowers() {
        this.$http.get(`/api/user/${this.currentUser.id}/followUser`).then(res => {
          this.followers = res.data.data;
        })
      },
      getCurrentUserLikePosts() {
        this.$http.get(`/api/user/${this.currentUser.id}/post_like`).then(res => {
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
      goProfile(id) {
        this.$router.push(`/u/${id}`);
        localStorage.setItem('currentTab', 'profile');
      },
      sendMsg(id) {
        this.$router.push(`/news/write/${id}`);
        localStorage.setItem('currentTab', 'news');
        localStorage.setItem('currentNewsType', 'write');
      }
    },
    components: {
      topNav
    }
  }
</script>
<style scoped lang="stylus">
  .follow {
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
            .list {
              position relative
              width 100%
              margin 0 0 15px
              padding 15px 2px 20px 0
              border-bottom 1px solid #f0f0f0
              .avatar {
                width 60px
                height 60px
                margin-left -2px
                display inline-block
                cursor pointer
                img {
                  width 100%
                  height 100%
                  border 1px solid #ddd
                  border-radius 50%
                }
              }
              .title {
                padding 5px 0 0 10px
                .name {
                  display inline
                  font-size 21px
                  font-weight 700
                  vertical-align middle
                }
              }
            }
          }
        }
      }
    }
  }

  @media screen and (min-width: 768px)
    .follow {
      .el-main {
        width 750px
      }
    }

  @media screen and (min-width: 992px)
    .follow {
      .el-main {
        width 970px
      }
    }

  @media screen and (min-width: 1081px)
    .follow {
      .el-main {
        width 960px
      }
    }
</style>
