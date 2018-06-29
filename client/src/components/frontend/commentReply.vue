<template>
  <div style="margin-top: 20px;">
    <div v-if="!reply">
      <div class="commentInput">
        <textarea class="form-control" rows="2" v-model="replyComment" placeholder="请写下你的回复"></textarea>
      </div>
      <div class="commentBtn">
        <button type="button" @click="cancelReply()" class="btn btn-secondary">取消</button>
        <button type="button" @click="sendReply(comment._id, comment.auth, comment.authId)" class="btn btn-success">发送</button>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name    : 'commentReply',
    props   : ['comment', 'currentUserName', 'reply'],
    data() {
      return {
        replyComment: ''
      }
    },
    mounted : function () {
    },
    computed: {},
    methods : {
      sendReply(commentId, auth, authId) {
        this.$emit('toReply', true);
        let data = {
          commentId: commentId,
          content  : this.replyComment,
          auth     : auth,
          authId   : authId,
          user     : this.currentUserName,
          userId   : localStorage.getItem('currentUserId'),
          create_at: this.$moment().format('YYYY-MM-DD HH:mm:ss')
        }
          if(this.replyComment) {
            this.$http.post(`/api/addReplyComments`, data).then(res => {
              this.replyComment = '';
              this.$http.get(`/api/comment/${commentId}/getReply`).then(res => {
                res.data.forEach(data => {
                  data.create_at = this.$moment(data.create_at).format('YYYY-MM-DD HH:mm:ss');
                })
                this.$emit('replyData', res.data);
              })
            })
          }
      },
      cancelReply() {
        this.$emit('toReply', true);
      }
  },
  components: {
  }
  }
</script>
<style scoped lang="stylus">
  .card-title
    display flex
    small
      margin-left auto

  .commentBtn
    text-align right

  .commentInput
    display flex
    margin-bottom 10px
    textarea
      font-size 13px
      border-radius 4px
      outline none
</style>
