<template>
  <el-row class="comment">
    <el-row class="trigger-menu">
      <el-row class="item active">
        <a>评论列表</a>
      </el-row>
    </el-row>
    <el-row class="list-container">
      <el-row class="note-list">
        <el-row v-for="list in lists" class="list">
          <el-row>
            <el-col :span="2">
              <a :href="`/u/${list.send.id}`" class="avatar">
                <img :src="list.send.avatar" alt="头像">
              </a>
            </el-col>
            <el-col :span="22" class="info">
              <el-row>
                <a :href="`/u/${list.send.id}`" class="user">{{list.send.username}}</a>
                <span class="comment-slogan">评论了你的文章</span>
                <a :href="`/detail/${list.comment.PostId}`">《{{list.type_title}}》</a>
              </el-row>
              <el-row class="time">{{getTime(list.createdAt)}}</el-row>
            </el-col>
          </el-row>
          <el-row class="news_content">{{list.comment.content}}</el-row>
        </el-row>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>

  export default {
    name      : 'n_comment',
    props     : ['lists'],
    data() {
      return {

      }
    },
    mounted   : function () {
    },
    methods   : {
      getTime(time) {
        return this.$moment(time).format('YYYY.MM.DD HH:mm:ss')
      }
    },
    components: {
    }
  }
</script>
<style lang="stylus">
  .comment {
    .news_content {
      margin 10px 0
      font-size 15px
      line-height 1.7
    }
  }
</style>
