<template>
  <el-container class="is-vertical articleDetail">
    <top-nav></top-nav>
    <el-main>
      <div class="article" data-spy="scroll" data-target="#navbar-example">
        <h1 class="title">{{data.title}}</h1>
        <div class="author">
          <a class="avatar">
            <img :src="data.avatar" alt="avatar">
          </a>
          <div class="info">
            <span class="name">
              <a>{{data.auth}}</a>
            </span>
            <a class="btn btn-success" :class="{follow: followActive, following: !followActive}" v-if="displayFollowBtn(data.authId)">
              <span v-if="followActive" @click="addFollow(data.authId)">+ 关注</span>
              <span class="hasFollow" v-else>已关注</span>
              <span class="removeFollow" @click="removeFollow(data.authId)">取消关注</span>
            </a>
            <div class="meta">
              <span class="publish-time">{{data.create_at}}</span>
              <span>标签： {{data.tagTitle}}</span>
            </div>
          </div>
          <a v-if="currentUser && currentUser.id === data.authId" class="edit" @click="edit()">编辑文章</a>
        </div>
        <div ref="content" class="markdown-body content" v-html="data.content"></div>
      </div>
      <div class="meta-bottom" v-if="currentUser">
        <div class="like" @click="likePostOrNot()">
          <div class="btn like-group" :class="likePost ? 'like-animation' : ''">
            <div class="btn-like">
              <a>喜欢</a>
            </div>
            <div v-if="post_like_num > 0" class="modal-wrap">
              <a>{{post_like_num}}</a>
            </div>
          </div>
        </div>
      </div>
      <div id="navbar-example">
        <!-- 导航 a中href="#one" 来寻找锚点-->
        <ul class="nav nav-pills nav-stacked tabLists" role="tablist">
          <li role="presentation" v-for="list in sideLists"><a :href=" `#${list.jump}`" :title="list.title">{{list.title}}</a>
          </li>
          <li v-show="toTop" @click="goTop()">返回顶部</li>
        </ul>
      </div>
      <div class="writeComment">
        <comment :commentNum="comment_num" :post="postId"></comment>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import topNav from '../topNav.vue';
  import comment from './comment.vue';

  export default {
    name      : 'detail',
    data() {
      return {
        currentUser  : JSON.parse(localStorage.getItem('currentUser')),
        postId       : this.$route.params.id,
        data         : '',
        sideLists    : [],
        toTop        : false,
        scrollTop    : document.body.scrollTop || document.documentElement.scrollTop,
        likePost     : false,
        post_like_num: 0,
        followActive : true,
        authId       : null,
        comment_num  : 0
      }
    },
    mounted   : function () {
      this.getArticle();
      window.addEventListener('scroll', this.handleScroll);
      this.getUserLikePosts();
      this.getUserFollow();
    },
    methods   : {
      displayFollowBtn(authId) {
        if (this.currentUser) {
          if (this.currentUser.id === authId) {
            return false;
          }
          return true;
        }
        return true;
      },
      getArticle() {
        this.$http.get(`/api/post/${this.postId}`).then(res => {
          if (res.data.success) {
            this.data = res.data.data;
            this.data.create_at = this.$moment(this.data.create_at).format('YYYY.MM.DD HH:mm:ss');
            this.data.auth = res.data.data.User.username;
            this.data.avatar = res.data.data.User.avatar;
            this.data.authId = res.data.data.UserId;
            this.data.tagTitle = res.data.data.Tag.title;
            this.post_like_num = res.data.data.like_num;
            this.authId = res.data.data.UserId;
            this.comment_num = res.data.data.comment_num;
          } else if (res.data.notFound) {
            this.$router.push('/404');
          }
        }).then(() => {
          this.addPreviewAttrForAllImages();
          this.rightSideBar();
          this.$previewRefresh();
        });
      },
      rightSideBar() {
        let nodes = $('.content').children('h1, h2');
        this.rightSideData(nodes);
      },
      rightSideData(tags) {
        let sideList = {};
        for (let i = 0; i < tags.length; i++) {
          tags[i].setAttribute('id', `nav-child-${i}`)
          sideList = {
            title: tags[i].innerHTML,
            jump : `nav-child-${i}`
          };
          this.sideLists.push(sideList);
        }
      },
      goTop() {
        $('html,body').animate({scrollTop: 0}, 500);
      },
      handleScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        this.toTop = scrollTop > 500 ? true : false;
      },
      edit() {
        this.$router.push(`/admin/articleManager/edit/${this.postId}`);
      },
      addPreviewAttrForAllImages() {
        let imgDOMs = this.$refs.content.querySelectorAll('img');
        for (let i = 0; i < imgDOMs.length; i++) {
          imgDOMs[i].setAttribute('preview', 1);
        }
      },
      likePostOrNot() {
        this.likePost = !this.likePost;
        this.likePost === true ? this.post_like_num++ : this.post_like_num--;
        this.$http.put(`/api/post/${this.postId}/like`, {
          like_num: this.post_like_num
        }).then(() => {
          if (this.likePost) {
            this.$http.post(`/api/user/${this.currentUser.id}/post/${this.postId}/like`);
          } else {
            this.$http.delete(`/api/user/${this.currentUser.id}/post/${this.postId}/like`);
          }
        })
      },
      getUserLikePosts() {
        if (this.currentUser) {
          this.$http.get(`/api/user/${this.currentUser.id}/post_like`).then(res => {
            res.data.data.forEach(d => {
              if (d.PostId === parseInt(this.postId)) {
                this.likePost = true;
              }
            })
          })
        }
      },
      getUserFollow() {
        if (this.currentUser) {
          this.$http.get(`/api/user/${this.currentUser.id}/followUser`).then(res => {
            res.data.data.forEach(d => {
              if (d.follow_id === this.authId) {
                this.followActive = false;
              }
            })
          })
        }
      },
      addFollow(authId) {
        if (this.currentUser) {
          this.$http.post(`/api/user/${this.currentUser.id}/followUser/${authId}`).then(res => {
            this.followActive = false;
          });
        } else {
          this.$router.push('/login')
        }
      },
      removeFollow(authId) {
        this.$http.delete(`/api/user/${this.currentUser.id}/followUser/${authId}`).then(res => {
          this.followActive = true;
        });
      }
    },
    components: {
      topNav,
      comment
    }
  }
</script>
<style lang="stylus">
  .articleDetail {
    width 100%
    height 100%
    .el-main {
      width 960px
      margin-left auto
      margin-right auto
      position relative
      overflow visible
      .article {
        width 80%
        margin 0 auto
        padding 60px
        padding-top 70px
        background #fff
        box-shadow 0 0 2px 0 rgba(0, 0, 0, .36)
        position relative
        .title {
          font-size 34px
          font-weight 700
          line-height 34px
          padding-bottom 20px
        }
        .author {
          text-align left
          margin 30px 0 40px
          .avatar {
            cursor pointer
            width 48px
            height 48px
            vertical-align middle
            display inline-block
            img {
              width 100%
              height 100%
              border 1px solid #ddd
              border-radius 50%
            }
          }
          .info {
            vertical-align middle
            display inline-block
            margin-left 8px
            .name {
              margin-right 3px
              font-size 16px
              vertical-align middle
            }
            .btn {
              font-weight 400
              line-height normal
              border-color #42c02e
              padding 0 7px 0 5px
              font-size 12px
              border-radius 40px
            }
            .follow {
              border-color #42c02e
              color #ffffff
              background-color #42c02e
            }
            .following {
              background none
              color #8c8c8c
              border 1px solid hsla(0, 0%, 59%, .6)
              &:hover {
                .hasFollow {
                  display none
                }
                .removeFollow {
                  display inline-block
                }
              }
            }
            a {
              color #333
              cursor pointer
            }
            .meta {
              margin-top 5px
              font-size 12px
              color #969696
              span {
                padding-right 5px
              }
            }
            .removeFollow {
              display none
            }
          }
          .edit {
            float right
            margin-top 8px
            padding 0 12px
            font-size 14px
            border 1px solid #dcdcdc
            color #9b9b9b
            line-height 30px
            border-radius 50px
            cursor pointer
          }
        }
        .content {
          margin-top 35px
          color #2f2f2f
          font-size 16px
          font-weight 400
          line-height 1.7
          text-align left
          pre {
            background-color #f6f6f6
            padding 16px
            -ms-word-wrap normal
            word-wrap normal
            -ms-word-break break-word
            white-space pre
            overflow auto
            color #657b83
            margin-bottom 20px
            font-size 13px
            line-height 1.42857
            border 1px solid #ccc
          }
        }
      }
      .meta-bottom {
        width 80%
        margin 40px auto 80px
        padding-left 5%
        text-align left
        .like {
          display inline-block
          .like-group {
            position relative
            padding 13px 0 15px 0
            font-size 0
            border 1px solid #ea6f5a
            border-radius 40px
            &.like-animation {
              background-color #ea6f5a
              a {
                color white !important
              }
              .btn-like:before {
                background-position right
              }
              .modal-wrap {
                border-left 1px solid white
              }
            }
            .btn-like {
              display inline-block
              font-size 19px
              &:before {
                content ''
                position absolute
                left 12px
                top 2px
                width 50px
                height 50px
                background-image url(../../assets/like.png)
                background-position left
                background-repeat no-repeat
                background-size 1000px 50px
              }
              a {
                position relative
                padding 18px 30px 18px 55px
                color #ea6f5a
              }
            }
            .modal-wrap {
              font-size 18px
              border-left 1px solid rgba(236, 97, 73, .4)
              display inline-block
              margin-left -15px
              a {
                padding 18px 26px 18px
                color #ea6f5a
              }
            }
          }
        }
        .share-group {
          float right
          margin-top 6px
        }
      }
      #navbar-example {
        position fixed
        bottom 40px
        right 448px
        .tabLists {
          position fixed
          bottom 20px
          left 84%
          display block
          li {
            text-align left
            height 30px
            font-size 14px
            cursor pointer
            a {
              color #666
            }
          }
        }
      }
      .writeComment {
        width 80%
        margin 60px auto
        position relative
      }
    }
  }

  @media screen and (max-width: 786px)
    .articleDetail {
      .el-main {
        width 100%
        padding 0
        .article {
          width 100%
          padding 35px
          padding-top 70px
          position relative
          .header {
            .title {
              font-size 30px
            }
          }
          .content {
            h1 {
              font-size 28px
            }
            h2 {
              font-size 24px
            }
            h3 {
              font-size 20px
            }
            h4 {
              font-size 18px
            }
            h5 {
              font-size 16px
            }
            h6 {
              font-size 14px
            }
          }
        }
        .writeComment {
          width 100%
          margin 40px auto
        }
        #navbar-example {
          .tabLists {
            left 2%
            z-index 100
            opacity 0.8
          }
        }
      }
    }


</style>
