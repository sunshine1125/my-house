<template>
  <div class="detail">
    <div class="article">
      <div class="header">
        <!--<div class="iconImage" :style="{backgroundImage: 'url(' + imgSrc + ')'}"></div>-->
        <!--<img :src="imgSrc" alt="">-->
        <h1 class="title">{{title}}</h1>
      </div>
      <div class="time"><span class="auth">由 {{auth}}</span> 发布于：<span>{{date}}</span> &nbsp;&nbsp;标签：<span class="tag">{{tagTitle}}</span></div>
      <div class="content" v-html="content"></div>
    </div>
  </div>
</template>

<script>

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
    components: {}
  }
</script>
<style>
  .detail {
    width: 40%;
    height: 90%;
    margin: 60px auto;
    padding: 60px;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, .36);
  }
  .detail .article .title {
    font-size: 34px;
    font-weight: 700;
    line-height: 34px;
    padding-bottom: 20px;
    z-index: 10;
  }

  .article .time {
    font-size: 14px;
    margin-bottom: 20px;
  }
  .article .time .auth {
    /*font-size: 12px;*/
    margin-right: 10px;
  }

  .article .content {
    color: #2f2f2f;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.7;
    text-align: left;
  }

  .article .content pre {
    background-color: #f6f8fa;
    line-height: 1.45;
    padding: 16px;
    -ms-word-wrap: normal;
    word-wrap: normal;
    -ms-word-break: break-word;
    /*word-break: break-word;*/
    white-space: pre;
    overflow: auto;
  }

  .detail .header {
    width: 100%;
    text-align: center;
  }

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
  .tag {
    background-color: rgba(64, 158, 225, .1);
    padding: 5px 10px;
    line-height: 30px;
    font-size: 12px;
    color: #409eff;
    border-radius: 5px;
    box-sizing: border-box;
    border: 1px solid rgba(64, 158, 255, .2);
  }
</style>
