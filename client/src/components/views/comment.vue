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
      <el-row class="comment-item" v-for="(item, i) in commentLists" :key="item._id">
        <el-row>
          <el-row class="author">
            <el-col :span="3">
              <img class="pic" width="40" height="40" :src="item.User.avatar" alt="avatar">
            </el-col>
            <el-col :span="10" class="info">
              <a href="">{{item.User.username}}</a>
              <div class="meta">
                <span>{{item.floor}}楼 · {{formatDate(item.create_at)}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row class="comment-wrap">
            <p>{{item.content}}</p>
            <el-row class="tool-group">
              <a class="like-button">
                <span>赞</span>
              </a>
              <a @click="reply(i, item.User.username)">
                <i class="el-icon-edit-outline"></i>
                <span>回复</span>
              </a>
              <a class="comment-delete" @click="deleteComment(item.id)" v-if="item.UserId === currentUser.id">
                <span>删除</span>
              </a>
            </el-row>
          </el-row>
        </el-row>
        <!--reply comments-->
        <el-row class="sub-comment-list" v-if="item.reply || item.Replies.length">
          <!--subComments lists-->
          <el-row v-for="subItem in item.Replies" class="sub-comment">
            <el-row class="v-tooltip">
              <div class="v-tooltip-container">
                <a>{{subItem.auth}}：</a>
              </div>
              <div class="v-tooltip-container">
                <a v-if="item.User.id !== subItem.UserId">@{{item.User.username}}</a>
                 {{subItem.content}}
              </div>
            </el-row>
            <el-row class="sub-tool-group">
              <span>{{formatDate(subItem.create_at)}}</span>
              <a @click="reply(i, subItem.auth)">
                <i class="el-icon-edit-outline"></i>
                <span>回复</span>
              </a>
              <a v-if="currentUser.id === subItem.UserId" class="subcomment-delete" @click="deleteReply(subItem.id)">
                <span>删除</span>
              </a>
            </el-row>
          </el-row>
          <el-row v-if="item.reply">
            <el-row class="new-comment">
              <el-input :rows="3" :placeholder="`回复${reply_username}：`" type="textarea"
                        v-model="item.replyContent"
                        @keyup.enter.ctrl.native="sendReply(i, item.replyContent, item.id)">
              </el-input>
            </el-row>
            <el-row class="sendTool">
              <el-col :span="6" class="tip">
                Ctrl+Enter发表
              </el-col>
              <el-col :span="6" :offset="12">
                <el-button size="medium" type="text" @click="cancelReply(i)">取消</el-button>
                <el-button size="medium" type="success" plain round @click="sendReply(i, item.replyContent, item.id)">发送</el-button>
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
        commentLists: [],
        reply_username: null
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
        this.$http.get(`/api/get/post/${this.post}/comment`).then(res => {
          let data = res.data.data;
          data.map(d => {
            d.reply = false;
            d.replyContent = '';
          });
          this.commentLists = data.sort(this.sortNumber)
        })
      },
      sortNumber(a, b) {
        return b.floor-a.floor;
      },
      send() {
        if (! this.comment.content) return this.$message.warning('评论内容不能为空');
        this.comment.floor = this.commentLists.length + 1;
        this.$http.post(`/api/user/${this.currentUser.id}/post/${this.post}/comment/create`, this.comment).then(res => {
          this.getCommentLists();
          this.comment.content = '';
          this.canSend = false;
          this.$message.success('评论成功');
        })
      },
      formatDate(date) {
        return this.$moment(date).format('YYYY.MM.DD hh:mm:ss');
      },
      deleteComment(id) {
        this.$http.delete(`/api/comment/${id}/destroy`).then(() => {
          this.getCommentLists();
          this.$message.success('删除成功');
        })
      },
      reply(index, username) {
        this.reply_username = username;
        this.commentLists[index].reply = !this.commentLists[index].reply;
      },
      cancelReply(index) {
        this.commentLists[index].reply = false;
      },
      sendReply(index, content, commentId) {
        if (! content) return this.$message.warning('回复内容不能为空');
        this.$http.post(`/api/user/${this.currentUser.id}/comment/${commentId}/reply/create`, {
          content: content,
          auth   : this.currentUser.username,
          create_at: this.$moment().format('YYYY-MM-DD HH:mm:ss')
        }).then(() => {
          this.getCommentLists();
          this.$message.success('回复成功');
        });
      },
      deleteReply(id) {
        this.$http.delete(`/api/reply/${id}/destroy`).then(() => {
          this.getCommentLists();
          this.$message.success('删除成功');
        })
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
            a {
              margin-right 10px
              font-size 14px
              color #969696
              display inline-block
              cursor pointer
              &.like-button {
                position relative
                padding-left 23px
                &:before {
                  content ''
                  position absolute
                  left -16px
                  top -16px
                  width 50px
                  height 50px
                  background-image url(../../../static/images/zan_animation.png)
                  background-position left
                  background-repeat no-repeat
                  -webkit-background-size 1050px 50px
                  background-size 1050px 50px
                }
              }
              span {
                vertical-align middle
                font-size 14px
              }
              &.comment-delete {
                float right
                display none
              }
            }
            &:hover {
              .comment-delete {
                display inline-block
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
          .sub-comment {
            padding-bottom 15px
            border-bottom 1px dashed #f0f0f0
            .v-tooltip {
              margin 0 0 5px
              font-size 14px
              line-height 1.5
              text-align left
              .v-tooltip-container {
                display inline-block
                a {
                  color: #3194d0
                }
              }
            }
            .sub-tool-group {
              text-align left
              font-size 12px
              color #969696
              a {
                margin-left 10px
                color #969696
                cursor pointer
                i {
                  margin-right 5px
                  font-size 14px
                  vertical-align middle
                }
                span {
                  vertical-align middle
                }
              }
            }
            .subcomment-delete {
              float right
              display none
            }
            &:hover {
              .subcomment-delete {
                display inline-block
              }
            }
          }
        }
      }
    }
  }
</style>
