<template>
  <div class="detail">
    <div class="article">
      <div class="header">
        <img :src="imgSrc" alt="">
        <h1 class="title">{{title}}</h1>
      </div>
      <div class="time">发布时间：<span>{{date}}</span></div>
      <div class="content" v-html="content"></div>
    </div>
  </div>
</template>

<script>
  import swal from 'sweetalert2'

  export default {
    name      : 'detail',
    data() {
      return {
        title  : '',
        date   : '',
        content: '',
        imgSrc : ''
      }
    },
    mounted   : function () {
      if (this.$route.query) {
        this.$http.get('/api/post/getDetailPost/' + this.$route.query.id).then(res => {
          this.title = res.data.title;
          this.date = res.data.date.substring(0, 10);
          this.content = res.data.content;
          this.imgSrc = res.data.image;
        });
      }
    },
    methods   : {},
    components: {}
  }
</script>
<style>
  .detail {
    width: 40%;
    margin: auto;
  }

  .detail .article .title {
    margin: 20px 0;
    -ms-word-break: break-word;
    word-break: break-word !important;
    font-size: 34px;
    font-weight: 700;
  }

  .article .time {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .article .content {
    color: #2f2f2f;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.7;
    text-align: left;
  }

  .article .content pre {
    background-color: #f6f6f8;
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
    height: 100px;
    position: relative;
  }

  .detail .header img {
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    opacity: 0.5;
    z-index: 10;
  }

  .detail .header h1 {
    height: 100px;
    line-height: 100px;
  }
</style>
