<template>
  <div class="articlesListView">
    <div class="header">
      <h1>所有文章</h1>
    </div>
    <div class="article-list" v-for="article in articlesList">
      <div class="card mb-3">
        <div class="card-body">
          <h5 @click="getDetail(article._id)" class="card-title">{{article.title}}</h5>
          <p class="card-text content" v-html="getContent(article.content)"></p>
          <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
        </div>
      </div>
      <!--<el-row class="box-card" v-for="article in articlesList">-->
        <!--<el-card>-->
          <!--&lt;!&ndash;<img src="" alt="" class="image">&ndash;&gt;-->
          <!--<div>-->
            <!--<h1  class="articleTitle">{{article.title}}</h1>-->
            <!--<p class="content" v-html="getContent(article.content)"></p>-->
            <!--<div class="bottom clearfix">-->
              <!-- - by-->
              <!--<time>{{article.auth}}</time>-->
              <!--<time class="time">{{article.date}}</time>-->
              <!--<el-button type="text" class="button" @click="getDetail(article._id)">阅读全文 >></el-button>-->
            <!--</div>-->
          <!--</div>-->
        <!--</el-card>-->
      <!--</el-row>-->
      <!--<div class="tags-list">-->
        <!--<h1>标签</h1>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  import removeMd from 'remove-markdown'
  import 'bootstrap/dist/css/bootstrap.css';

  export default {
    name      : 'articlesList',
    data() {
      return {
        articlesList: []
      }
    },
    mounted   : function () {
      this.getAllArticles();
    },
    methods   : {
      getAllArticles() {
        let that = this;
        this.$http.get('/api/post/getAllArticles')
          .then((res) => {
            if (res.data.success && res.data.data) {
              res.data.data.forEach((data) => {
                that.$http.get(`/api/getSingleUserById/${data.uid}`).then((res) => {
                  return res.data.data.username;
                }).then((auth) => {
                  this.articlesList.push({
                    auth    : auth,
                    content : data.content,
                    date    : that.$moment(data.date).format('YYYY-MM-DD HH:mm:ss'),
                    tagTitle: data.tagTitle,
                    title   : data.title,
                    _id     : data._id
                  })
                })
              })
            }
          })
      },
      getContent(content) {
        return removeMd(content);
      },
      getDetail(id) {
        this.$router.push(`/detail/${id}`);
      }
    }
  }
</script>
<style scoped lang="stylus">
  .articlesListView {
    width: 100%;
    position: relative;
    .header {
      margin: 20px;
    }
    .article-list {
      position: relative;
      width: 640px;
      margin: 20px auto;
      text-align: left;
      .time {
        font-size: 13px;
        color: #999;
      }
      .bottom {
        margin-top: 13px;
        line-height: 12px;
      }
      .button {
        padding: 0;
        float: right;
      }
      .image {
        width: 100%;
        display: block;
      }
      .clearfix:before,
      .clearfix:after {
        display: table;
        content: '';
      }
      .clearfix:after {
        clear: both;
      }
      .box-card {
        width: 100%;
        display: block;
        margin: 20px 0 0 0;
        text-align: left;
        .articleTitle {
          display: inline-block;
          &:hover {
             cursor: pointer;
             color: rgb(64, 158, 255);
           }
        }
        .content {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  @media screen and (max-width:786px) {
    .article-list {
      width: 640px
    }
  }
  @media screen and (max-width:480px) {
    .article-list {
      width: 80% !important;
    }
  }

</style>
