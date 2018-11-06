<template>
  <el-row>
    <el-row class="trigger-menu">
      <el-row class="item active">
        <a>关注列表</a>
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
              <span class="comment-slogan">评论了你的文章</span>
              <a :href="`/detail/${list.comment.PostId}`">《{{list.comment.post_title}}》</a>
            </el-row>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
  import topNav from '../topNav.vue'
  import removeMd from 'remove-markdown'

  export default {
    name      : 'n_write',
    data() {
      return {
        currentUser: JSON.parse(localStorage.getItem('currentUser')),
        typeObj    : {
          'comment': null,
          'write'  : null,
          'like'   : null,
          'follow' : null
        },
        lists      : []
      }
    },
    mounted   : function () {
      this.getMessage();
    },
    methods   : {
      getMessage() {
        if (!this.currentUser) return false;
        this.$http.get(`/api/user/${this.currentUser.id}/msg`).then(msg => {
          msg.data.data.forEach(m => {
            this.typeObj[m.type] ++;
          })
        })
      },
      getCurTypeMsg(type) {
        this.$http.get(`/api/user/${this.currentUser.id}/${type}`).then(msg => {
//          if (type === 'comment') {
//            msg.data.data.map(d => {
//              this.$http.get(`/api/post/${d.comment.PostId}/msg`).then(t => {
//                d.comment.post_title = t.data.data;
//              })
//            })
            this.lists = msg.data.data;
//          }
        })
//        this.$http.put(`/api/user/${this.currentUser}/type`).then(() =>{
////          this.typeObj[type] = null
//        })
      },
      getTime(time) {
        return this.$moment(time).format('YYYY.MM.DD HH:mm:ss')
      },
      goProfile(id) {
        this.$router.push(`/u/${id}`);
      }
    },
    components: {
      topNav
    }
  }
</script>
<style lang="stylus">
</style>
