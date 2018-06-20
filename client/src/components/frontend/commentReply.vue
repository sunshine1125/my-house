<template>
  <div>
    <p class="card-text" v-if="reply">
      <span><small style="cursor: pointer" @click="replyInfo()">回复</small></span>
    </p>
    <div v-if="!reply">
      <div class="commentInput">
      <textarea class="form-control" rows="2" v-model="replyComment"
                placeholder="请写下你的回复"></textarea>
      </div>
      <div class="commentBtn">
        <button type="button" @click="cancelReply()" class="btn btn-secondary">取消</button>
        <button type="button" @click="sendReply(comment._id, comment.auth, comment.authId)"
                class="btn btn-success">发送
        </button>
      </div>
    </div>
    <div style="font-size: 14px;">
      <small style="color: #3194d0;">{{currentUserName}}：</small>
      <span><small style="color: #3194d0;">@{{comment.auth}} </small>{{replyComment}}</span>
    </div>
  </div>
</template>

<script>

  export default {
    name    : 'commentReply',
    props   : ['comment', 'currentUserName'],
    data() {
      return {
        reply       : true,
        replyComment: ''
      }
    },
    mounted : function () {
      this.getCommentReply();
    },
    computed: {},
    methods : {
      getCommentReply() {
        this.$http.get('/api/getReplyComments').then(res => {
          this.replyComment = res.data.data.content;
          console.log(res.data.data)
        })
      },
      replyInfo() {
        this.reply = false;
      },
      sendReply(commentId, auth, authId) {
        this.reply = true;
        let data = {
          commentId: commentId,
          content  : this.replyComment,
          auth     : auth,
          authId   : authId,
          user     : this.currentUserName,
          userId   : localStorage.getItem('currentUserId'),
          create_at: this.$moment().format('YYYY-MM-DD')
        }
          if(this.replyComment) {
            this.$http.post('/api/addReplyComments', data).then(res => {
              this.$http.get('/api/getReplyComments').then(res => {
                console.log(res);
              })
            })
          }
      },
      cancelReply() {
        this.reply = true;
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
