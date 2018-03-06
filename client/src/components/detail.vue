<template>
  <div class="detail">
    <div class="article">
      <h1 class="title">{{title}}</h1>
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
        title: '',
        date: '',
        content: ''
      }
    },
    mounted   : function () {
      if (this.$route.query) {
        this.$http.get('/api/post/getDetailPost/' + this.$route.query.id).then(res => {
          this.title = res.data.title;
          this.date = res.data.date.substring(0, 10);
          this.content = res.data.content;
        });
      }
    },
    methods   : {

    },
    components: {}
  }
</script>
<style>
  .detail {
    width: 40%;
    margin: auto;
  }
  .detail .article .title{
    margin: 20px 0;
    -ms-word-break: break-word;
    word-break: break-word!important;
    font-size: 34px;
    font-weight: 700;
    line-height: 1.3;
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
</style>
