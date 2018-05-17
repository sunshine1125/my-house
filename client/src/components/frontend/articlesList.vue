<template>
  <div class="articlesListView">
    <navBar></navBar>
    <div class="header">
      <h1>{{articleTitle}}</h1>
    </div>
    <div class="article-list">
      <div>
        <div v-if="hasArticles" class="card mb-3" v-for="article in articlesList">
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
        <div style="text-align: center;" v-if="!hasArticles"><p>您选择的分类下没有文章</p></div>
      </div>
      <div class="tags-list">
        <h5>Tags</h5>
        <div class="tag">
          <span @click="getAllArticles()" class="badge badge-pill badge-info">全部文章</span>
        </div>
        <div class="tag" v-for="tag in tags">
          <span @click="getArticlesByTag(tag._id, tag.title)" class="badge badge-pill badge-info">{{tag.title}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import navBar from './navBar.vue'
  import removeMd from 'remove-markdown'

  export default {
    name      : 'articlesList',
    data() {
      return {
        articlesList   : [],
        tags           : [],
        hasArticles    : true,
        articleTitle   : '所有文章'
      }
    },
    mounted   : function () {
      this.getAllArticles();
      this.getTags();
    },
    methods   : {
      processArticlesFormat(article) {
        article.forEach((data) => {
          this.$http.get(`/api/getSingleUserById/${data.uid}`).then((res) => {
            return res.data.data.username;
          }).then((auth) => {
            this.articlesList.push({
              auth    : auth,
              content : data.content,
              date    : this.$moment(data.date).format('YYYY-MM-DD HH:mm:ss'),
              tagTitle: data.tagTitle,
              title   : data.title,
              _id     : data._id
            })
          })
        })
      },
      getAllArticles() {
        this.articleTitle = '所有文章';
        this.$http.get('/api/post/getAllArticles')
          .then((res) => {
            if (res.data.success && res.data.data) {
              if (res.data.data.length === 0) {
                this.articlesList = [];
                this.hasArticles = false;
              } else {
                this.hasArticles = true;
                this.processArticlesFormat(res.data.data);
              }
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
      getArticlesByTag(id, title) {
        this.articlesList = [];
        this.articleTitle = title;
        this.$http.get(`/api/getArticlesByTag/${id}`).then((res) => {
          if (res.data.success && res.data.data) {
            if (res.data.data.length === 0) {
              this.articlesList = [];
              this.hasArticles = false;
            } else {
              this.hasArticles = true;
              this.processArticlesFormat(res.data.data);
            }
          }
        })
      }
    },
    components: {
      navBar
    }
  }
</script>
<style scoped lang="stylus">
  .articlesListView
    width 100%
    position relative
    .header
      margin 20px
      margin-top 80px
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
      width 90% !important
      .tags-list
        display none
</style>
