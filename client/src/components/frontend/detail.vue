<template>
  <div>
    <navBar></navBar>
    <div class="articleDetail">
      <div class="article" data-spy="scroll" data-target="#navbar-example" style="position: relative; height: auto;">
        <div class="header">
          <h1 class="title">{{title}}</h1>
        </div>
        <div class="time"><span class="auth">由 {{auth}}</span> 发布于：<span>{{date}}</span> &nbsp;&nbsp;标签：<span class="tag">{{tagTitle}}</span>
        </div>
        <div class="content" v-html="content"></div>
      </div>
      <div id="navbar-example">
        <!-- 导航 a中href="#one" 来寻找锚点-->
        <ul class="nav nav-pills nav-stacked tabLists" role="tablist">
          <li role="presentation" v-for="list in sideLists"><a :href=" `#${list.jump}`" :title="list.title">{{list.title}}</a></li>
          <li v-show="displayGoTop" @click="goTop()">返回顶部</li>
        </ul>
      </div>
      <div class="like row" v-if="hasLogin">
        <div class="likeNum col-sm-6 col-6">
          <div class="btn like-group" :class="{active: isLike }">
            <div v-if="!isLike" class="btn-like" @click="giveLike()">
              <a>喜欢</a>
            </div>
            <div v-if="isLike" class="btn-like" @click="deleteLike()">
              <a>喜欢</a>
            </div>
            <div class="modal-wrap">
              <a>{{likeNum}}</a>
            </div>
          </div>
        </div>
        <!--MOB SHARE BEGIN-->
        <div class="col-sm-6 col-6">
          <div class="-mob-share-open btn btn-outline-success">分享</div>
        </div>
        <div class="-mob-share-ui -mob-share-ui-theme -mob-share-ui-theme-slide-top" style="display: none">
          <ul class="-mob-share-list">
            <li class="-mob-share-weibo"><p>新浪微博</p></li>
            <li class="-mob-share-qzone"><p>QQ空间</p></li>
            <li class="-mob-share-qq"><p>QQ好友</p></li>
            <li class="-mob-share-weixin"><p>微信</p></li>
            <li class="-mob-share-douban"><p>豆瓣</p></li>
            <li class="-mob-share-facebook"><p>Facebook</p></li>
            <li class="-mob-share-twitter"><p>Twitter</p></li>
          </ul>
          <div class="-mob-share-close">取消</div>
        </div>
        <div class="-mob-share-ui-bg"></div>
        <!--MOB SHARE END-->
      </div>
      <div class="writeComment">
        <div class="commentInput">
          <img v-if="hasLogin" class="pic" width="40" height="40" :src="userAvatar"/>
          <div v-if="!hasLogin" class="form-control needToLogin">
            <a class="btn btn-success btn-sm" role="button" href="#/login">登录</a> 后发表评论！
          </div>
          <textarea v-if="hasLogin" class="form-control" rows="3" v-model="newComment" placeholder="请写下你的评论"></textarea>
        </div>
        <div class="commentBtn" v-if="hasLogin">
          <button type="button" @click="cancel()" class="btn btn-secondary">取消</button>
          <button type="button" @click="send()" class="btn btn-success">发送</button>
        </div>
      </div>
      <div class="comment">
        <div class="title" data-title="评论"></div>
        <div v-if="hasComment" v-for="(comment, index) in commentInfo">
          <div class="card mb-3">
            <div class="card-body">
              <div class="row card-body" style="padding-bottom: 0; padding-top: 0;">
                <div class="column">
                  <img class="pic" :src="comment.avatar" width="50" height="50" alt="">
                </div>
                <div class="column">
                  <p class="card-title">
                    <strong>{{comment.auth}}</strong>
                  </p>
                  <p style="font-size: 12px; color: #969696;">
                    <span>{{comment.index + 1}}楼 · {{comment.date}}</span>
                  </p>
                </div>
              </div>
              <p class="card-text">{{comment.content}}</p>
              <comment-reply :comment="comment" :currentUserName="currentUserName"></comment-reply>
            </div>
          </div>
        </div>
        <div v-if="!hasComment" style="text-align: center">
          <p>暂时还没有评论！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import navBar from './navBar.vue';
  import commentReply from './commentReply.vue'
  export default {
    name      : 'detail',
    data() {
      return {
        title          : '',
        date           : '',
        content        : '',
        imgSrc         : '',
        tagTitle       : '',
        uid            : '',
        auth           : '',
        currentUserName: '',
        newComment     : '',
        hasComment     : false,
        commentInfo    : [],
        hasLogin       : false,
        userAvatar     : '',
        url            : `http://140.143.192.183:8003/#/detail/${this.$route.params.id}`,
        isLike         : false,
        likeNum        : 0,
        sideLists      : [],
        displayGoTop   : false,
        scrollTop      : document.body.scrollTop || document.documentElement.scrollTop
      }
    },
    mounted   : function () {
      this.getArticle();
      this.getComments();
      if (localStorage.getItem('currentUserId')) {
        this.hasLogin = true;
        if (JSON.parse(localStorage.getItem('userInfo')).roleId === 1) {
          this.$http.get(`/api/getSingleUserById/${localStorage.getItem('currentUserId')}`).then(res => {
            this.currentUserName = res.data.data.username;
            this.userAvatar = res.data.data.avatar;
          })
        } else {
          this.$http.get(`/api/getUserById/${localStorage.getItem('currentUserId')}`).then(res => {
            this.currentUserName = res.data.data.username;
            this.userAvatar = res.data.data.avatar;
          })
        }

        let that = this;
        this.$http.get(`/api/like/active/${localStorage.getItem('currentUserId')}`).then(res => {
          if (res.data.data.length > 0) {
            res.data.data.forEach(item => {
              if (item.articleId === that.$route.params.id) {
                that.isLike = item.active;
              }
            })
          }
        })

      } else {
        this.hasLogin = false;
        this.currentUserName = '游客'
      }
      window.addEventListener('scroll', this.handleScroll);
    },
    computed  : {},
    methods   : {
      rightSideBar() {
        let nodes = $('.content').children('h1, h2');
        this.rightSideData(nodes);

      },
      rightSideData (tags) {
        let sideList = {};
        for (let i = 0; i < tags.length; i++ ) {
          tags[i].setAttribute('id', `nav-child-${i}`)
          sideList = {
            title: tags[i].innerHTML,
            jump : `nav-child-${i}`
          }
          this.sideLists.push(sideList);
        }
      },
      getArticle() {
        if (this.$route.params.id) {
          this.$http.get(`/api/post/getDetailPost/${this.$route.params.id}`).then(res => {
            this.title = res.data.title;
            this.date = this.$moment(res.data.date).format('YYYY-MM-DD HH:mm:ss');
            this.content = res.data.content;
            this.imgSrc = res.data.image;
            this.tagTitle = res.data.tagTitle;
            this.uid = res.data.uid;
            this.likeNum = res.data.likeNum || 0;
          })
            .then(() => {
              this.$http.get(`/api/getSingleUserById/${this.uid}`).then((res) => {
                this.auth = res.data.data.username;
                this.rightSideBar();
              })
            });
        }
      },
      send() {
        let commentInfo = {
          auth     : this.currentUserName,
          authId   : localStorage.getItem('currentUserId'),
          content  : this.newComment,
          date     : this.$moment().format('YYYY-MM-DD HH:mm:ss'),
          articleId: this.$route.params.id,
          avatar   : this.userAvatar
        }
        if (this.newComment) {
          this.$http.post('/api/addComment', commentInfo).then((res) => {
            if (res.data.success) {
              this.newComment = '';
              this.getComments();
            }
          })
        }
      },
      getComments() {
        this.$http.get(`/api/getComments/${this.$route.params.id}`).then(res => {
          if (res.data.success && res.data.data.length > 0) {
            this.hasComment = true;
            this.commentInfo = [];
            for (let len = res.data.data.length, i = len - 1; i >= 0; i--) {
              res.data.data[i].date = this.$moment(res.data.data[i].date).format('YYYY-MM-DD HH:mm:ss');
              res.data.data[i].index = i;
              this.commentInfo.push(res.data.data[i]);
            }
          } else {
            this.hasComment = false;
          }
        })
      },
      cancel() {
        this.newComment = '';
      },
      giveLike() {
        this.isLike = true;
        this.likeNum ++;
        let data = {
          articleId: this.$route.params.id,
          active   : this.isLike,
          user     : localStorage.getItem('currentUserId')
        };
        this.$http.put(`/api/post/${this.$route.params.id}/like`, {
          likeNum: this.likeNum
        }).then(res => {
          this.$http.post(`/api/like/active`, data);
        });
      },
      deleteLike() {
        this.isLike = false;
        this.likeNum --;
        this.$http.put(`/api/post/${this.$route.params.id}/like`, {
          likeNum: this.likeNum
        }).then(res => {
          this.$http.delete(`/api/like/${this.$route.params.id}/active`);
        });
      },
      goTop() {
        $('html,body').animate({scrollTop:0}, 500);
      },
      handleScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        this.displayGoTop = scrollTop > 500 ? true : false;
      }
    },
    components: {
      navBar,
      commentReply
    }
  }
</script>
<style scoped lang="stylus">
  .articleDetail
    width 740px
    height 100%
    margin 20px auto
    position relative
    .article
      padding 60px
      background #fff
      box-shadow 0 0 2px 0 rgba(0, 0, 0, .36)
      .title
        font-size 34px
        font-weight 700
        line-height 34px
        padding-bottom 20px
        z-index 10
      .time
        font-size 14px
        margin-bottom 20px
        .auth
          margin-right 10px
      .content
        color #2f2f2f
        font-size 16px
        font-weight 400
        line-height 1.7
        text-align left
        >>> pre
          background-color #f6f6f6
          line-height 1.45
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
      .header
        width: 100%
        text-align: center
      .tag
        background-color rgba(64, 158, 225, .1)
        padding 5px 10px
        line-height 30px
        font-size 12px
        color #409eff
        border-radius 5px
        box-sizing border-box
        border 1px solid rgba(64, 158, 255, .2)
    .comment
      text-align left
      .pic
        border-radius 50%
        margin-right 10px
      .title
        position relative
        padding 40px 20px
        font-size 24px
        color gray
        text-align center
        &:before
          content attr(data-title)
          position relative
          display inline-block
          padding 0 10px
          background-color #f5f5f5
          z-index 1
        &:after
          content ''
          display inline-block
          position absolute
          height 2px
          width 80%
          top 50%
          left 50%
          margin-left -40%
          background-color gray
          transform translateY(-50%)
      .card-title
        display flex
        small
          margin-left auto
    .commentBtn
      text-align right
    .commentInput
      display flex
      margin-bottom 10px
      textarea
        font-size 13px
        border-radius 4px
        outline none
    .writeComment
      padding-top 40px
      .needToLogin
        padding 0.75rem
        text-align center
      .pic
        border-radius 50%
        margin-right 10px
    .like
      padding-top 40px
      .likeNum
        display inline-block
        .like-group
          position relative
          padding 8px 0
          font-size 0px
          border 1px solid #ea6f5a
          border-radius 40px
          &:hover
            background-color rgba(236, 97, 73, 0.05)
            display inline-block
          .btn-like
            display inline-block
            font-size 19px
            &:before
              content ''
              position absolute
              left 12px
              top -3px
              width 50px
              height 50px
              background-image url(../../assets/like.png)
              background-position left
              background-repeat no-repeat
              background-size 1000px 50px
            a
              position relative
              padding 18px 30px 18px 55px
              color #ea6f5a
          .modal-wrap
            font-size 18px
            border-left 1px solid rgba(236, 97, 73, 0.4)
            display inline-block
            margin-left -15px
            a
              color #ea6f5a
              padding 18px 26px 18px 18px
              cursor pointer
        .active
          background-color #ea6f5a
          &:hover
            background-color #ea6f5a
          .btn-like
            &:before
              background-position right
            a
              color white
          .modal-wrap
            border-left 1px solid white
            a
              color white
    #navbar-example
      position fixed
      bottom 40px
      right 448px
      .tabLists
        position fixed
        bottom 20px
        right 23%
        display block
        li
          text-align left
          height 30px
          font-size 14px
          cursor pointer
          a
            color #666

  @media screen and (max-width: 786px)
    .articleDetail
      width 90% !important
      .article
        padding 40px !important

  @media screen and (max-width: 480px)
    .articleDetail
      width 90% !important
      margin-top 70px !important
      .article
        padding 40px !important
</style>
