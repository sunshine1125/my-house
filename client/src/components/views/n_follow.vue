<template>
  <el-row class="follow">
    <el-row class="trigger-menu">
      <el-row class="item active">
        <a>全部关注</a>
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
                <span class="comment-slogan">关注了你</span>
              </el-row>
              <el-row class="time">{{getTime(list.createdAt)}}</el-row>
            </el-col>
          </el-row>
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

</style>
