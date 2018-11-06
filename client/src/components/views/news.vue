<template>
  <div class="news">
    <top-nav></top-nav>
    <el-main>
      <el-row class="container">
        <el-col :span="6" class="aside">
          <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :router="true">
            <el-menu-item class="item-nav" index="/news/comments" @click="getCurTypeMsg('comment')">
              <i class="el-icon-menu"></i>
              <span slot="title">评论</span>
              <el-badge class="marked" :value="typeObj['comment']"></el-badge>
            </el-menu-item>
            <el-menu-item class="item-nav" index="/news/write" @click="getCurTypeMsg('write')">
              <i class="el-icon-menu"></i>
              <span slot="title">简信</span>
              <el-badge class="marked" :value="typeObj['write']"></el-badge>
            </el-menu-item>
            <el-menu-item class="item-nav" index="/news/like" @click="getCurTypeMsg('like')">
              <i class="el-icon-menu"></i>
              <span slot="title">喜欢和赞</span>
              <el-badge class="marked" :value="typeObj['like']"></el-badge>
            </el-menu-item>
            <el-menu-item class="item-nav" index="/news/follow" @click="getCurTypeMsg('follow')">
              <i class="el-icon-menu"></i>
              <span slot="title">关注</span>
              <el-badge class="marked" :value="typeObj['follow']"></el-badge>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :offset="2" :span="16" class="main">
          <router-view :lists="lists"></router-view>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
  import topNav from '../topNav.vue'

  export default {
    name      : 'news',
    data() {
      return {
        currentUser: JSON.parse(localStorage.getItem('currentUser')),
        typeObj    : {
          'comment': null,
          'write'  : null,
          'like'   : null,
          'follow' : null
        },
        lists      : [],
        initTab    : localStorage.getItem('currentNewsType')
      }
    },
    mounted   : function () {
      if (!this.initTab) {
        localStorage.setItem('currentNewsType', 'comment');
        this.initTab = 'comment'
      }
      this.getMessage();
      this.getCurTypeMsg(this.initTab);
    },
    methods   : {
      getMessage() {
        if (!this.currentUser) return false;
        this.$http.get(`/api/user/${this.currentUser.id}/msg`).then(msg => {
          msg.data.data.forEach(m => {
            this.typeObj[m.type]++;
          })
        })
      },
      getCurTypeMsg(type) {
        this.lists = [];
        this.$http.get(`/api/user/${this.currentUser.id}/message/${type}`).then(msg => {
          this.lists = msg.data.data;
          localStorage.setItem('currentNewsType', type);
          console.log(this.lists);
          this.$http.put(`/api/user/${this.currentUser.id}/${type}`).then(() => {
            this.typeObj[type] = null;
          })
        })
      },
    },
    components: {
      topNav
    }
  }
</script>
<style lang="stylus">
  .news {
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
        .aside {
          .item-nav {
            position relative
            .marked {
              float right
            }
          }
        }
        .main {
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
                padding 20px
                border-bottom 1px solid #f0f0f0
                .avatar {
                  width 40px
                  height 40px
                  margin-right 5px
                  display inline-block
                  cursor pointer
                  img {
                    width 100%
                    height 100%
                    border 1px solid #ddd
                    border-radius 50%
                  }
                }
                .info {
                  display inline-block
                  vertical-align top
                  font-size 0
                  line-height 1.7
                  a {
                    font-size 15px
                    color #3194d0
                    cursor pointer
                  }
                  .user {
                    font-size 15px
                    color #333
                    margin 0 5px 0 0
                    &:hover {
                      color #3194d0
                      text-decoration underline
                    }
                  }
                  span {
                    font-size 15px
                    color #333
                  }
                  .time {
                    margin-top 2px
                    font-size 12px
                    color #969696
                    line-height normal
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  @media screen and (min-width: 768px)
    .news {
      .el-main {
        width 750px
      }
    }

  @media screen and (min-width: 992px)
    .news {
      .el-main {
        width 970px
      }
    }

  @media screen and (min-width: 1081px)
    .news {
      .el-main {
        width 960px
      }
    }
</style>
