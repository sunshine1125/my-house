<template>
  <el-row class="comment">
    <el-row data-title="评论" class="line"></el-row>
    <!--write comment-->
    <el-row v-if="currentUser">
      <el-row style="margin-bottom: 8px;">
        <el-col :span="3">
          <img class="pic" width="40" height="40" :src="currentUser.avatar" alt="avatar">
        </el-col>
        <el-col :span="21">
          <el-input @focus="makeSend()" :rows="3" placeholder="请写下您的评论..." type="textarea"
                    v-model="comment.content"
                    @keyup.enter.ctrl.native="send()">
          </el-input>
        </el-col>
      </el-row>
      <el-row class="sendTool" v-if="canSend">
        <el-col :span="6" :offset="3" class="tip">
          Ctrl+Enter发表
        </el-col>
        <el-col :span="6" :offset="9">
          <el-button size="medium" type="text" @click="cancel()">取消</el-button>
          <el-button size="medium" type="success" plain round @click="send()">发送</el-button>
        </el-col>
      </el-row>
    </el-row>
    <el-row v-if="!currentUser">
      <el-button size="medium" plain round type="success" @click="login()">登录</el-button>
      后发表评论
    </el-row>
    <!--comment lists-->
    <el-row class="comment-list">
      <el-row class="top-title">
        <span>全部评论（{{commentLists.length}}）</span>
      </el-row>
      <el-row class="comment-item" v-for="item in commentLists" :key="item._id">
        <el-row>
          <el-row class="author">
            <el-col :span="3">
              <img class="pic" width="40" height="40" :src="item.User.avatar" alt="avatar">
            </el-col>
            <el-col :span="10" class="info">
              <a href="">{{item.User.username}}</a>
              <div class="meta">
                <span>{{item.index + 1}}楼 · {{item.create_at}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row class="comment-wrap">
            <p>{{item.content}}</p>
            <el-row class="tool-group">
              <el-button @click="reply()" type="text"><i class="el-icon-edit-outline"></i> 回复</el-button>
            </el-row>
          </el-row>
        </el-row>
        <!--reply comments-->
        <el-row class="sub-comment-list" v-if="toReply">
          <el-row v-if="toReply">
            <el-row class="new-comment">
              <el-input :rows="3" placeholder="请写下您的评论..." type="textarea"
                        v-model="测试"
                        @keyup.enter.ctrl.native="sendReply()">
              </el-input>
            </el-row>
            <el-row class="sendTool">
              <el-col :span="6" class="tip">
                Ctrl+Enter发表
              </el-col>
              <el-col :span="6" :offset="12">
                <el-button size="medium" type="text" @click="cancelReply()">取消</el-button>
                <el-button size="medium" type="success" plain round @click="sendReply()">发送</el-button>
              </el-col>
            </el-row>
          </el-row>
        </el-row>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
  export default {
    name      : 'comment',
    props     : ['post'],
    data() {
      return {
        currentUser : JSON.parse(localStorage.getItem('currentUser')),
        comment     : {
          content  : '',
          create_at: this.$moment().format('YYYY-MM-DD HH:mm:ss')
        },
        canSend     : false,
        toReply     : false,
        commentLists: []
      }
    },
    mounted   : function () {
      this.getCommentLists();
    },
    methods   : {
      makeSend() {
        if (!this.canSend) {
          this.canSend = true;
        }
      },
      login() {
        this.$router.push('/login');
      },
      cancel() {
        this.comment.content = '';
        this.canSend = false;
      },
      getCommentLists() {
        this.commentLists = [];
        this.$http.get(`/api/get/post/${this.post}/comment`).then(res => {
          let data = res.data.data;
          for(let i = data.length - 1; i > -1; i--) {
            data[i].index = i;
            data[i].create_at = this.$moment(data[i].create_at).format('YYYY.MM.DD hh:mm:ss');
            this.commentLists.push(data[i]);
          }
        })
      },
      send() {
        if (this.comment.content !== '') {
          this.$http.post(`/api/user/${this.currentUser.id}/post/${this.post}/comment/create`, this.comment).then(res => {
            this.getCommentLists();
            this.comment.content = '';
            this.canSend = false;
          })
        } else {
          this.$message.warning('评论内容不能为空');
        }
      },
      reply() {
        this.toReply = true;
      },
      cancelReply() {
        this.toReply = false;
      },
      sendReply() {
        this.toReply = false;
      }
    },
    components: {}
  }
</script>
<style scoped lang="stylus">
  .comment {
    .el-button {
      outline none
    }
    width 85%
    margin 0 auto
    .line {
      position relative
      width 100%
      margin-bottom 40px
      font-size 24px
      color gray
      text-align center
      &:before {
        content attr(data-title)
        position relative
        display inline-block
        padding 0 10px
        background-color #f5f5f5
        z-index 1
      }
      &:after {
        content ''
        display inline-block
        width 100%
        position absolute
        height 2px
        top 50%
        left 0
        background-color gray
        transform translateY(-50%)
      }
    }
    .pic {
      border-radius 50%
    }
    .sendTool {
      .el-col {
        text-align right
      }
      .tip {
        text-align left
        padding 10px 20px
        font-size 13px
        color #969696
      }
    }
    .comment-list {
      margin-top 30px
      .top-title {
        text-align left
        padding-bottom 10px
        font-size 17px
        font-weight 700
        border-bottom 1px solid #d0d0d0
      }
      .comment-item {
        padding 20px 0 30px
        border-bottom 1px solid #d0d0d0
        .author {
          .info {
            text-align left
            a {
              font-size 15px
              color #333
              &:hover {
                text-decoration none
              }
            }
            .meta {
              font-size 12px
              color #969696
            }
          }
        }
        .comment-wrap {
          text-align left
          padding-left 20px
          p {
            font-size 16px
            margin 10px 0px
            line-height 1.5
          }
          .tool-group {
            .el-button {
              color #969696
              font-size 14px
              &:hover {
                color #333
              }
              i {
                padding-left 4px
              }
            }
          }
        }
        .sub-comment-list {
          margin-top 20px
          padding 5px 0 5px 20px
          border-left 2px solid #d9d9d9
          .new-comment {
            margin-bottom 5px
          }
          .sendTool{
            .tip {
              padding-left 5px
            }
          }
        }
      }
    }
  }
</style>
