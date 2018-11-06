<template>
  <el-row class="like">
    <el-row class="trigger-menu">
      <el-row class="item active">
        <a>收到的喜欢和赞</a>
      </el-row>
    </el-row>
    <el-row class="list-container">
      <el-row class="note-list">
        <el-row v-for="list in lists" class="list">
          <el-col :span="2">
            <a :href="`/u/${list.send.id}`" class="avatar">
              <img :src="list.send.avatar" alt="头像">
            </a>
          </el-col>
          <el-col :span="22" class="info">
            <el-row>
              <a :href="`/u/${list.send.id}`" class="user">{{list.send.username}}</a>
              <span v-if="list.c_like && !list.post" class="comment-slogan">点赞了你的评论</span>
              <span v-else class="comment-slogan">喜欢了你的文章</span>
              <a v-if="list.c_like && !list.post" :href="`/detail/${list.post_id}`"><span class="news_comment">{{list.type_title}}</span></a>
              <a v-else :href="`/detail/${list.like.PostId}`">《{{list.type_title}}》</a>
            </el-row>
            <el-row class="time">{{getTime(list.createdAt)}}</el-row>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>

  export default {
    name      : 'n_like',
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
  .like {
    .news_comment {
      margin-left 5px
      color #3194d0 !important
    }
  }
</style>
