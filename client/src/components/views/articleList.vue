<template>
  <el-container class="wrapper is-vertical">
    <top-nav></top-nav>
    <el-main>
      <h3>{{pageTitle}}</h3>
      <el-row v-if="articleLists.length === 0"><h5 style="margin-top: 20px;">您选择的分类下没有文章</h5></el-row>
      <el-row v-else class="article" :key="article._id" v-for="article in articleLists">
        <el-card :body-style="{ padding: '0px' }">
          <img @click="readAll(article.id)" :src="article.cover" class="image">
          <div style="padding: 14px; text-align: left;">
            <span class="articleTitle" @click="readAll(article.id)">{{article.title}}</span>
            <p class="content" v-html="getContent(article.content)"></p>
            <div class="bottom clearfix">
              <time class="time">- by {{article.auth}} &nbsp; 发布于：{{ article.create_at }}</time>
              <el-button type="text" class="button" @click="readAll(article.id)">阅读全文>></el-button>
            </div>
          </div>
        </el-card>
      </el-row>
      <el-row class="tagList">
        <h5 class="tagTitle">分类</h5>
        <div style="text-align: left;">
          <el-row>
            <el-badge index="0" :key="0" class="item">
              <el-button :type="selectedTagId === 0 ? 'primary' : null" :plain="selectedTagId === 0" @click="clickGetAll()" size="small">全部文章</el-button>
            </el-badge>
          </el-row>
          <el-row v-for="tag in tagLists" :key="tag.id">
            <el-badge class="item" :key="tag.id" :index="tag.id">
              <el-button :type="selectedTagId === tag.id ? 'primary' : null" :plain="selectedTagId === tag.id" @click="switchTag(tag.id, tag.title)" size="small">{{tag.title}}</el-button>
            </el-badge>
          </el-row>
        </div>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import topNav from '../topNav.vue'
  import removeMd from 'remove-markdown'

  export default {
    name      : 'articleList',
    data() {
      return {
        articleLists : [],
        tagLists     : [],
        page         : 0,
        limit        : 4,
        selectedTagId: 0,
        temp         : null,
        pageTitle    : '全部文章',
        currentUser  : JSON.parse(localStorage.getItem('currentUser'))
      }
    },
    mounted   : function () {
      this.getAllPosts(this.changeTag);
      this.getAllTags();
      window.addEventListener('scroll', this.handleScroll);
    },
    methods   : {
      clickGetAll() {
        $('html,body').animate({scrollTop:0}, 500);
        this.pageTitle = '全部文章';
        this.page = 0;
        this.temp = null;
        this.articleLists = [];
        this.getAllPosts();
      },
      getAllPosts() {
        this.selectedTagId = 0;
        let skip = this.page * this.limit;
        this.$http.get(`/api/post?skip=${skip}&limit=${this.limit}`).then(res => {
          this.processData(res);
        })
      },
      processData(res) {
        if (res.data.data) {
          if (res.data.data.length > 0) {
            res.data.data.forEach(item => {
              item.create_at = this.$moment(item.create_at).format('YYYY-MM-DD HH:mm:ss');
              item.auth = item.User.username;
              this.articleLists.push(item);
            });
            this.page++;
          }
        }
      },
      getAllTags() {
        this.$http.get('/api/tag').then(res => {
          this.tagLists = res.data.data;
        })
      },
      getContent(content) {
        return removeMd(content);
      },
      readAll(id) {
        this.$router.push(`/detail/${id}`);
      },
      switchTag(id, title) {
        $('html,body').animate({scrollTop:0}, 500);
        this.pageTitle = title;
        this.page = 0;
        this.temp = null;
        this.articleLists = [];
        this.getTagArticles(id);
      },
      getTagArticles(id) {
        let skip = this.page * this.limit;
        this.selectedTagId = id;
        this.$http.get(`/api/tag/${id}/post?skip=${skip}&limit=${this.limit}`).then(res => {
          this.processData(res);
        })
      },
      handleScroll() {
        let scrollTop = $('html, body').scrollTop();
        let scrollHeight = $(document).height();
        let windowHeight = $(window).height();
        if (scrollTop + windowHeight === scrollHeight && this.page !== 0) {
          if (this.temp !== this.page) {
            if (this.selectedTagId === 0) {
              this.getAllPosts();
            } else {
              this.getTagArticles(this.selectedTagId);
            }
          }
          this.temp = this.page;
        }
      }
    },
    components: {
      topNav
    }
  }
</script>
<style scoped lang="stylus">
  .wrapper {
    width 100%
    height 100%
    .el-header {
      position fixed
      top 0
      left 0
    }
    .el-main {
      width 960px
      height 100%
      margin-left auto
      margin-right auto
      margin-top 60px
      position relative
      overflow visible
      .article {
        width 70%
        margin 0 auto
        margin-bottom 1rem
        .image {
          width 100%
          display block
          height 200px
          cursor pointer
        }
        .time {
          font-size 13px
          color #999
        }
        .articleTitle {
          font-size 18px
          &:hover {
            cursor pointer
            color rgb(64, 158, 255)
          }
        }
        .content {
          overflow hidden
          -ms-text-overflow ellipsis
          text-overflow ellipsis
          white-space nowrap
        }
        .bottom {
          margin-top: 13px;
          line-height: 12px;
        }
        .button {
          padding 0px
          float right
        }
        .clearfix:before,
        .clearfix:after {
          display: table;
          content: "";
        }
        .clearfix:after {
          clear: both
        }
      }
      .tagList {
        position fixed
        top 95px
        left 70%
        .tagTitle {
          text-align left
          padding-left 10px
        }
        .item {
          margin-bottom 5px
          button {
            -webkit-border-radius: 10rem
            -moz-border-radius: 10rem
            border-radius: 10rem
            outline none
          }
        }
      }
    }
  }

  @media screen and (max-width: 786px)
    .wrapper {
      .el-main {
        width 100%
        padding 0
        .article{
          width 85%
        }
        .tagList {
          left 0
          z-index 100
          opacity 0.8
        }
      }
    }
</style>
