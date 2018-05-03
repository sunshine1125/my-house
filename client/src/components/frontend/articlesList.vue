<template>
  <div class="articlesListView">
    <div class="header">
      <h1>所有文章</h1>
    </div>
    <div class="article-list">
      <div>
        <div class="card mb-3" v-for="article in articlesList">
          <div class="card-body">
            <h5 @click="getDetail(article._id)" class="card-title articleTitle">{{article.title}}</h5>
            <p class="card-text content" v-html="getContent(article.content)"></p>
            <p class="card-text">
              <small class="text-muted">
                -by
                <time>{{article.auth}}</time>
                发布于：
                <time>{{article.date}}</time>
              </small>
              <small class="articleDetail">
                <button type="button" class="btn btn-link" @click="getDetail(article._id)">阅读全文 >></button>
              </small>
            </p>
          </div>
        </div>
      </div>
      <div class="tags-list">
        <h5>Tags</h5>
        <div class="tag">
          <span class="badge badge-pill badge-info">全部文章</span>
        </div>
        <div class="tag" v-for="tag in tags">
          <span @click="getArticlesByTag(tag._id)" class="badge badge-pill badge-info">{{tag.title}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import removeMd from 'remove-markdown'
  import 'bootstrap/dist/css/bootstrap.css';

  export default {
    name   : 'articlesList',
    data() {
      return {
        articlesList: [],
        tags:[]
      }
    },
    mounted: function () {
      this.getAllArticles();
      this.getTags();
    },
    methods: {
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
      },
      getTags() {
        this.$http.get('/api/getTag').then((res) => {
          this.tags = res.data.data;
        })
      },
      getArticlesByTag(id) {
        this.$http.get(`/api/getArticlesByTag/${id}`).then((res) =>{

        })
      }
    }
  }
</script>
<style scoped lang="stylus">
  .articlesListView
    width 100%
    position relative
    .header
      margin 20px
    .article-list
      position relative
      width 640px
      margin 20px auto
      text-align left
      .articleTitle
        display inline-block
        &:hover
          cursor pointer
          color rgb(64, 158, 255)
      .content
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
      .articleDetail
        display inline-block
        float right
      .tags-list
        position absolute
        top 0
        left 100%
        margin-left 40px
        .tag
          margin-bottom 5px
          .badge
            padding-left 8px
            padding-right 8px
            cursor pointer

  @media screen and (max-width: 786px)
    .article-list
      width 640px

  @media screen and (max-width: 480px)
    .article-list
      width 70% !important
      margin-left 8%!important
      .tags-list
        margin-left 20px!important
</style>
