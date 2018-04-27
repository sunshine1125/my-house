<template>
  <div class="articlesList">
    <h1 class="header">所有文章</h1>
    <div>
      <el-row class="box-card" v-for="article in articlesList">
        <el-card>
          <!--<img src="" alt="" class="image">-->
          <div>
            <h1 @click="getDetail(article._id)" class="articleTitle">{{article.title}}</h1>
            <p class="content" v-html="getContent(article.content)"></p>
            <div class="bottom clearfix">
              - by
              <time>{{article.auth}}</time>
              <time class="time">{{article.date}}</time>
              <el-button type="text" class="button" @click="getDetail(article._id)">阅读全文 >></el-button>
            </div>
          </div>
        </el-card>
      </el-row>
    </div>
  </div>
</template>

<script>
  import removeMd from 'remove-markdown'

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
    },
    components: {}
  }
</script>
<style scoped>
  .articlesList {
    width: 40%;
    margin: auto;
  }

  .articlesList .header {
    padding: 40px 0 30px 0;
  }

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
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
    display: block;
    /*padding: 20px 0;*/
    margin: 20px 0 0 0;
    text-align: left;
  }

  .box-card .articleTitle {
    display: inline-block;
  }

  .box-card .articleTitle:hover {
    cursor: pointer;
    color: rgb(64, 158, 255);

  }

  .box-card .content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
