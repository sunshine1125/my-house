<template>
  <div class="detail">
    <navBar></navBar>
    <div class="article">
      <div class="header">
        <!--<div class="iconImage" :style="{backgroundImage: 'url(' + imgSrc + ')'}"></div>-->
        <!--<img :src="imgSrc" alt="">-->
        <h1 class="title">{{title}}</h1>
      </div>
      <div class="time"><span class="auth">由 {{auth}}</span> 发布于：<span>{{date}}</span> &nbsp;&nbsp;标签：<span class="tag">{{tagTitle}}</span>
      </div>
      <div class="content" v-html="content"></div>
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
            <!--<p class="card-text" v-if="reply">-->
              <!--<span><small style="cursor: pointer" @click="replyInfo()">回复</small></span>-->
            <!--</p>-->
            <!--<div class="commentInput" v-if="!reply">-->
              <!--<textarea class="form-control" rows="2" v-model="replyComment"-->
                        <!--placeholder="请写下你的回复"></textarea>-->
            <!--</div>-->
            <!--<div class="commentBtn" v-if="!reply">-->
              <!--<button type="button" @click="cancelReply()" class="btn btn-secondary">取消</button>-->
              <!--<button type="button" @click="sendReply(comment._id, comment.auth, comment.authId)"-->
                      <!--class="btn btn-success">发送-->
              <!--</button>-->
            <!--</div>-->
            <!--<div>-->
              <!--<p style="color: #3194d0;">-->
                <!--<small>{{currentUserName}}：@-->
                  <!--<small>{{comment.auth}}</small>-->
                <!--</small>-->
              <!--</p>-->
            <!--</div>-->
          </div>
        </div>
      </div>
      <div v-if="!hasComment" style="text-align: center">
        <p>暂时还没有评论！</p>
      </div>
    </div>
  </div>
</template>

<script>
  import navBar from './navBar.vue';

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
        reply          : true,
        replyComment   : ''
      }
    },
    mounted   : function () {
      this.getArticle();
      this.getComments();
      if (localStorage.getItem('currentUserInfo')) {
        this.hasLogin = true;
        this.currentUserName = JSON.parse(localStorage.getItem('currentUserInfo')).currentUserName;
        this.userAvatar = JSON.parse(localStorage.getItem('currentUserInfo')).avatar;
      } else {
        this.hasLogin = false;
        this.currentUserName = '游客'
      }
    },
    computed  : {
//      commentFormat: (value) => {
//        if (!value) return ''
//        return value.map((item) =)
//      }
//      backgroundImage() {
//        return {
//          background: url(this.imgSrc) no-repeat center;
//        }
//      },
//      getImage() {
//        return {
//          backgroundImage: `${this.imgSrc}`
//        }
//      }
    },
    methods   : {
      getArticle() {
        if (this.$route.params.id) {
          this.$http.get(`/api/post/getDetailPost/${this.$route.params.id}`).then(res => {
            this.title = res.data.title;
            this.date = this.$moment(res.data.date).format('YYYY-MM-DD HH:mm:ss');
            this.content = res.data.content;
            this.imgSrc = res.data.image;
            this.tagTitle = res.data.tagTitle;
            this.uid = res.data.uid;
          })
            .then(() => {
              this.$http.get(`/api/getSingleUserById/${this.uid}`).then((res) => {
                this.auth = res.data.data.username;
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
      replyInfo() {
        this.reply = false;
      },
      sendReply(commentId, auth, authId) {
        this.reply = true;
        let data = {
          commentId    : commentId,
          replyContent : this.replyComment,
          replyPerson  : auth,
          replyPersonId: authId
        }
        if (this.replyComment) {
          this.$http.post('/api/addReplyComments', data).then(res => {
              this.$http.get('/api/getReplyComments').then(res => {
                console.log(res);
              })
          })
        }
      },
      cancelReply() {
        this.reply = true;
      }
    },
    components: {
      navBar
    }
  }
</script>
<style scoped lang="stylus">
  .detail
    width 640px
    height 100%
    margin 20px auto
    margin-top 80px
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
        pre
          background-color #f6f8fa
          line-height 1.45
          padding 16px
          -ms-word-wrap normal
          word-wrap normal
          -ms-word-break break-word
          white-space pre
          overflow auto
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
      margin-bottom 80px
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

  /*.detail .header .iconImage {*/
  /*position: absolute;*/
  /*width: 100%;*/
  /*height: 100%;*/
  /*display: block;*/
  /*opacity: 0.6;*/
  /*background-repeat: no-repeat;*/
  /*background-position: center;*/
  /*-webkit-background-size: 100% 150px;*/
  /*background-size: 100% 150px;*/
  /*}*/

  @media screen and (max-width: 786px)
    .detail
      width 640px

  @media screen and (max-width: 480px)
    .detail
      width 90% !important
      margin-top 70px !important
</style>
