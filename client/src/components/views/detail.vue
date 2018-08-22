<template>
  <el-container class="is-vertical articleDetail">
    <top-nav></top-nav>
    <el-main>
      <div class="article" data-spy="scroll" data-target="#navbar-example">
        <div class="header">
          <h1 class="title">{{data.title}}</h1>
        </div>
        <div class="time">
          <span class="auth">由 {{data.auth}}</span>
          发布于：<span>{{data.create_at}}</span>&nbsp;&nbsp;标签：
          <el-tag>{{data.tagTitle}}</el-tag>
        </div>
        <div class="content" v-html="data.content"></div>
      </div>
      <div id="navbar-example">
        <!-- 导航 a中href="#one" 来寻找锚点-->
        <ul class="nav nav-pills nav-stacked tabLists" role="tablist">
          <li role="presentation" v-for="list in sideLists"><a :href=" `#${list.jump}`" :title="list.title">{{list.title}}</a></li>
          <li v-show="toTop" @click="goTop()">返回顶部</li>
        </ul>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import topNav from '../topNav.vue';
  export default {
    name      : 'detail',
    data() {
      return {
        postId         : this.$route.params.id,
        data           : '',
        sideLists      : [],
        toTop          : false,
        scrollTop      : document.body.scrollTop || document.documentElement.scrollTop
      }
    },
    mounted   : function () {
      this.getArticle();
      window.addEventListener('scroll', this.handleScroll);
    },
    computed  : {

    },
    methods   : {
      getArticle() {
        this.$http.get(`/api/post/${this.postId}`).then(res => {
          if (res.data.success) {
            this.data = res.data.data;
            this.data.create_at = this.$moment(this.data.create_at).format('YYYY-MM-DD HH:mm:ss');
            this.data.auth = res.data.data.User.username;
            this.data.tagTitle = res.data.data.Tag.title;
          }
        }).then(() => {
          this.rightSideBar();
        });
      },
      rightSideBar() {
        let nodes = $('.content').children('h1, h2');
        this.rightSideData(nodes);
      },
      rightSideData (tags) {
        let sideList = {};
        for (let i = 0; i < tags.length; i++ ) {
          tags[i].setAttribute('id', `nav-child-${i}`)
          sideList = {
            title: tags[i].innerHTML,
            jump : `nav-child-${i}`
          };
          this.sideLists.push(sideList);
        }
      },
      goTop() {
        $('html,body').animate({scrollTop:0}, 500);
      },
      handleScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        this.toTop = scrollTop > 500 ? true : false;
      }
    },
    components: {
      topNav
    }
  }
</script>
<style lang="stylus">
  .articleDetail {
    width 100%
    height 100%
    .el-main {
      width 960px
      margin-left auto
      margin-right auto
      position relative
      overflow visible
      .article {
        width 80%
        margin 0 auto
        padding 60px
        background #fff
        box-shadow 0 0 2px 0 rgba(0, 0, 0, .36)
        position relative
        .header {
          .title {
            font-size 34px
            font-weight 700
            line-height 34px
            padding-bottom 20px
          }
          .time {
            font-size 14px
            margin-bottom 20px
          }
          .auth {
            margin-right 10px
          }
        }
        .content {
          color #2f2f2f
          font-size 16px
          font-weight 400
          line-height 1.7
          text-align left
          pre {
            background-color #f6f6f6
            padding 16px
            -ms-word-wrap normal
            word-wrap normal
            -ms-word-break break-word
            white-space pre
            overflow auto
            color #657b83
            margin-bottom 20px
            font-size 13px
            line-height 1.42857
            border 1px solid #ccc
          }
        }
      }
      #navbar-example {
        position fixed
        bottom 40px
        right 448px
        .tabLists {
          position fixed
          bottom 20px
          right 23%
          display block
          li {
            text-align left
            height 30px
            font-size 14px
            cursor pointer
            a {
              color #666
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 1300px)
    .articleDetail {
      .el-main {
        #navbar-example {
          .tabLists {
            right 15%
          }
        }
      }
    }

  @media screen and (max-width: 786px)
    .articleDetail {
      .el-main {
        width 100%
        padding 0
        .article {
          width 100%
          padding 35px
          .header {
            .title {
              font-size 30px
            }
          }
          .content {
            h1 {
              font-size 28px
            }
            h2 {
              font-size 24px
            }
            h3 {
              font-size 20px
            }
            h4 {
              font-size 18px
            }
            h5 {
              font-size 16px
            }
            h6 {
              font-size 14px
            }
          }
        }
      }
    }


</style>
