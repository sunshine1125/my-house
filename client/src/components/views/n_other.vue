<template>
  <el-row class="other">
    <el-row class="trigger-menu">
      <el-row class="item active">
        <a>关注者消息</a>
      </el-row>
    </el-row>
    <el-row class="list-container">
      <el-row class="note-list">
        <el-row v-if="lists.length > 0" v-for="list in lists" class="list">
          <el-row>
            <el-col :span="2">
              <a :href="`/u/${list.send.id}`" class="avatar">
                <img :src="list.send.avatar" alt="头像">
              </a>
            </el-col>
            <el-col :span="22" class="info">
              <el-row>
                <span class="comment-slogan">你关注的</span>
                <a :href="`/u/${list.send.id}`" class="user">{{list.send.username}}</a>
                <span v-if="!list.p_post && list.post" class="comment-slogan">发布了文章</span>
                <span v-else class="comment-slogan">喜欢了文章</span>
                <a v-if="!list.p_post && list.post" :href="`/detail/${list.post.id}`">《{{list.post.title}}》</a>
                <a v-else :href="`/detail/${list.p_post.PostId}`">《{{list.type_title}}》</a>
              </el-row>
              <el-row class="time">{{getTime(list.createdAt)}}</el-row>
            </el-col>
          </el-row>
        </el-row>
        <el-row v-if="lists.length === 0" class="findNothing">
          <img src="../../assets/nothing.png" alt="nothing">
          <el-row class="p">这里还没有内容哦~</el-row>
        </el-row>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>

  export default {
    name      : 'n_other',
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

</style>
