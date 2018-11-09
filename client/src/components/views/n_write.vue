<template>
  <el-row class="write">
    <el-row v-if="showLists" class="lists">
      <el-row class="trigger-menu">
        <el-row class="item active">
          <a>全部私信</a>
        </el-row>
      </el-row>
      <el-row class="list-container">
        <el-row class="note-list">
          <el-row v-if="lists.length > 0" v-for="list in lists" class="list" @click.native="goDetail(list.send_id, list.rec_id)">
            <el-col :span="2">
              <a :href="`/u/${list.send.id}`" class="avatar">
                <img :src="list.send.avatar" alt="头像">
              </a>
            </el-col>
            <el-col :span="22" class="info">
              <el-row>
                <el-col :span="10">
                  <a :href="`/u/${list.send.id}`" class="user">{{list.send.username}}</a>
                </el-col>
                <el-col :offset="11" :span="3" class="time">{{getTime(list.createdAt)}}</el-col>
              </el-row>
              <el-row class="msg-content">{{list.write.content}}</el-row>
            </el-col>
          </el-row>
          <el-row v-if="lists.length === 0" class="findNothing">
            <img src="../../assets/nothing.png" alt="nothing">
            <el-row class="p">这里还没有内容哦~</el-row>
          </el-row>
        </el-row>
      </el-row>
    </el-row>
    <el-row class="chat" v-if="!showLists">
      <el-row class="chat-top">
        <a class="back-to-list" @click="goLists()">
          <i></i>
          返回私信列表
        </a>
        <b>与<a :href="`/u/${rec_id}`">{{rec_name}}</a>的对话</b>
      </el-row>
      <el-row class="message-show">
        <ul class="message-list">
          <li v-for="item in detailMsg" v-if="detailMsg.length"
              :class="{'message-l': item.send_id !== currentUser.id, 'message-r': item.send_id === currentUser.id}">
            <a :href="`/u/${item.send_id}`" class="avatar">
              <img :src="item.send.avatar" alt="头像">
            </a>
            <el-row class="message-content">
              <span class="content">{{item.content}}</span>
            </el-row>
            <span class="time">{{getTime(item.createdAt)}}</span>
          </li>
        </ul>
      </el-row>
      <el-row class="write-message">
        <el-row class="formArea">
          <el-input :rows="2" placeholder="输入内容" type="textarea"
                    v-model="content"
                    @keyup.enter.ctrl.native="sendMsg()">
          </el-input>
          <el-row class="hint">Enter + Ctrl 发送</el-row>
          <el-button @click="sendMsg()" class="send" size="medium" type="success" round>发送</el-button>
        </el-row>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>

  export default {
    name      : 'n_write',
    props     : ['lists'],
    data() {
      return {
        currentUser: JSON.parse(localStorage.getItem('currentUser')),
        detailMsg  : [],
        content    : null,
        rec_id     : this.$route.params.id,
        rec_name   : null,
        showLists  : true
      }
    },
    mounted   : function () {
      if (this.$route.params.id) {
        this.showLists = false;
        this.getRecName();
        this.getDetailPersonMsg();
      }
    },
    methods   : {
      getRecName() {
        this.$http.get(`/api/user/get/${this.rec_id}`).then(res => {
          this.rec_name = res.data.user.username;
        })
      },
      getDetailPersonMsg() {
        this.$http.get(`/api/send/${this.currentUser.id}/rec/${this.rec_id}`).then(res => {
          this.detailMsg = res.data.data.sort(this.sortNumberByTime);
        })
      },
      sendMsg() {
        if (!this.content) return this.$message.error('发送内容不能为空！')
        this.$http.post(`/api/send/${this.currentUser.id}/rec/${this.rec_id}`, {
          content: this.content,
          floor  : this.detailMsg.length++
        }).then(res => {
          this.content = null;
          this.detailMsg = res.data.data.sort(this.sortNumberByTime);
          this.$http.post(`/api/send/${this.currentUser.id}/rec/${this.rec_id}/message/${res.data.messageId}/write`);
        })
      },
      getTime(time) {
        return this.$moment(time).format('MM.DD HH:mm');
      },
      sortNumberByTime(a, b) {
        return a.floor - b.floor;
      },
      goDetail(sendId, recId) {
        let id = null;
        if (sendId === this.currentUser.id) {
          id = recId;
        } else {
          id = sendId;
        }
        this.showLists = false;
        this.$router.push(`/news/write/${id}`);
      },
      goLists() {
        this.$emit('goWrite', 'write');
        this.$router.push('/news/write');
        this.showLists = true;
      }
    },
    watch: {
      "$route" (to, from) {
        if (to.path.length > 11) {
          this.showLists = false;
          this.rec_id = to.path.substr(to.path.lastIndexOf('/') + 1);
          this.getRecName();
          this.getDetailPersonMsg();
        } else {
          this.goLists();
        }
      }
    },
    components: {}
  }
</script>
<style lang="stylus">
  .write {
    .lists {
      .note-list {
        .list {
          cursor pointer
          .user {
            font-size 15px
          }
          .time {
            margin-top 8px !important
          }
          .msg-content {
            font-size 12px
            color #999
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
          }
        }
      }
    }
    .chat {
      .chat-top {
        position fixed
        width 625px
        z-index 1
        min-height 35px
        margin-bottom 20px
        padding-bottom 10px
        text-align center
        background-color #ffffff
        border-bottom 1px solid #f0f0f0
        &:before {
          content ''
          position absolute
          top -100px
          left 0
          heighgt 100px
          width 625px
          background-color #fff
        }
        .back-to-list {
          position absolute
          top 4px
          left 0
          font-size 14px
          color #969696
        }
        a {
          color #333
          text-decoration none
          cursor pointer
          &:hover {
            color #2f2f2f
          }
        }
        b {
          display inline-block
          padding 0 140px 0 160px
          font-size 14px
          font-weight 700
        }
      }
      .message-show {
        padding-top 46px
        .message-list {
          margin 0
          padding 10px 0 110px
          list-style none
          li {
            margin-bottom 15px
            overflow hidden
            display list-item
            text-align -webkit-match-parent
            line-height 20px
            .message-content {
              position relative
              display block
              margin 4px 56px 0px
              min-height 39px
              &:before, &:after {
                box-sizing border-box
                position absolute
                top 0
                content ''
                display inline-block
              }
              &:after {
                top 1px
              }
              .content {
                position relative
                padding 8px 12px
                font-size 14px
                border 1px solid
                word-break break-word !important
                line-height 1.5
                display table-cell
              }
            }
            .time {
              margin-top 2px
              font-size 12px
              color #d9d9d9
            }
            &.message-l {
              .avatar {
                float left
              }
              .message-content {
                &:before, &:after {
                  left -9px
                  border-left 9px solid transparent
                  border-top 16px solid #bad0e9
                }
                &:after {
                  left -7px
                  border-top 16px solid #e7f1fc
                }
                .content {
                  min-height 39px
                  background-color #e7f1fc
                  border-color #bad0e9
                  border-radius 0 4px 4px 4px
                }
              }
              .time {
                margin-left 56px
              }
            }
            &.message-r {
              .avatar {
                float right
              }
              .message-content {
                &:before, &:after {
                  right -9px
                  border-right 9px solid transparent
                  border-top 16px solid #d9d9d9
                }
                &:after {
                  right -7px
                  border-top 16px solid #eee
                }
                .content {
                  float right
                  min-height 39px
                  background-color #eee
                  border-color #d9d9d9
                  border-radius 4px 0 4px 4px
                }
              }
              .time {
                margin-left 56px
                float right
              }
            }
          }
        }
        .avatar {
          display block
          cursor pointer
          width 40px
          height 40px
          img {
            width 100%
            height 100%
            border 1px solid #ddd
            border-radius 50%
            vertical-align middle
          }
        }
      }
      .write-message {
        position fixed
        bottom 0
        width 100%
        margin-top 15px
        background-color #fff
        .formArea {
          max-width 625px
          margin 0 0 25px
          textarea {
            background-color hsla(0, 0%, 71%, .1)
          }
          .send {
            float right
            margin 10px 0
          }
        }
        .hint {
          padding-top 13px
          font-size 13px
          color #969696
          float left
        }
      }
    }
  }
</style>
