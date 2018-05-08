<template>
  <div class="detail">
    <navBar></navBar>
    <div class="article">
      <div class="header">
        <!--<div class="iconImage" :style="{backgroundImage: 'url(' + imgSrc + ')'}"></div>-->
        <!--<img :src="imgSrc" alt="">-->
        <h1 class="title">{{title}}</h1>
      </div>
      <div class="time"><span class="auth">由 {{auth}}</span> 发布于：<span>{{date}}</span> &nbsp;&nbsp;标签：<span class="tag">{{tagTitle}}</span></div>
      <div class="content" v-html="content"></div>
    </div>
    <div class="writeComment">
      <div>
        <strong>userName：</strong>
        <textarea class="form-control" rows="3" placeholder="请写下你的评论"></textarea>
      </div>
      <div>
        <button type="button" class="btn btn-secondary">取消</button>
        <button type="button" class="btn btn-success">发送</button>
      </div>
    </div>
    <div class="comment">
      <div class="title" data-title="评论"></div>
      <div>
        <div class="card mb-3">
          <div class="card-body">
            <p class="card-title">
              <strong>userName</strong>
              <small>评论于：</small>
            </p>
            <p class="card-text"></p>
            <p class="card-text">
              <small class="text-muted">
                -by
                <time>article.auth</time>
                发布于：
                <time>article.date</time>
              </small>
            </p>
          </div>
        </div>
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
        title   : '',
        date    : '',
        content : '',
        imgSrc  : '',
        tagTitle: '',
        uid     : '',
        auth    : ''
      }
    },
    mounted   : function () {
      this.getArticle();
    },
    computed: {
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
      getArticle () {
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
    .writeComment
      padding-top 40px
      div:first-child
        display flex
        margin-bottom 10px
        textarea
          font-size 13px
          border-radius 4px
          outline none
      div:nth-child(2)
        text-align right




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
      width 100% !important
      margin-top 0 !important
</style>
