<template>
  <div id="tagAction">
    <el-row>
      <strong>标签管理</strong>
    </el-row>
    <el-row class="tool">
      <el-button @click="addTag()" type="primary" plain round icon="el-icon-plus"
                 class="circle el-button--small"></el-button>
      <el-button class="goBack" type="text" @click="goBack()">返回 >></el-button>
    </el-row>
    <el-table :data="tags" border style="width: 100%;">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="editTag(scope.row.id, scope.row.title)" type="primary" icon="el-icon-edit" plain round
                     class="circle"></el-button>
          <el-button @click="removeTag(scope.row.id)" type="danger" icon="el-icon-delete" plain round
                     class="circle"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  export default {
    name   : 'articleManager',
    data() {
      return {
        tags       : [],
        currentUser: JSON.parse(localStorage.getItem('currentUser')),
        userId     : JSON.parse(localStorage.getItem('currentUser')).id
      }
    },
    mounted: function () {
      this.refreshData();
    },
    methods: {
      refreshData() {
        this.$http.get(`/api/tag`).then(res => this.tags = res.data.data);
      },
      addTag() {
        this.$prompt('请输入标题', '新增', {
          confirmButtonText: '确定',
          cancelButtonText : '取消',
          inputPattern     : /\S/,
          inputErrorMessage: '请输入标签'
        }).then(({value}) => {
          let tag = {
            title: value
          };
          this.$http.post(`/api/user/${this.userId}/tag/create`, tag).then((res) => {
            this.refreshData();
            this.$message({
              type   : 'success',
              message: value
            })
          });
        }).catch(() => {
          this.$message({
            type   : 'info',
            message: '取消输入'
          })
        })
      },
      editTag(id, title) {
        if (this.currentUser.admin) {
          this.$prompt('请输入标题', '编辑', {
            confirmButtonText: '确定',
            cancelButtonText : '取消',
            inputPattern     : /\S/,
            inputErrorMessage: '请输入标签',
            inputValue       : title
          }).then(({value}) => {
            let tag = {
              title: value
            };
            this.$http.put(`/api/tag/${id}/update`, tag).then((res) => {
              this.refreshData();
              this.$message({
                type   : 'success',
                message: '更新成功'
              })
            });
          }).catch(() => {
            this.$message({
              type   : 'info',
              message: '取消输入'
            })
          })
        } else {
          this.$message.error('您没有操作权限！')
        }
      },
      removeTag(id) {
        if (this.currentUser.admin) {
          this.$confirm('确定删除该标签，同时删除该标签下的文章？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText : '取消',
            type             : 'warning'
          }).then(() => {
            this.$http.delete(`/api/tag/${id}/destroy`).then((res) => {
              this.refreshData();
              this.$message({
                type   : 'success',
                message: '删除成功'
              })
            });
          }).catch(() => {
            this.$message({
              type   : 'info',
              message: '已取消删除'
            })
          })
        } else {
          this.$message.error('您没有操作权限！')
        }
      },
      goBack() {
        window.history.back();
      }
    }
  }
</script>
<style lang="stylus">
  #tagAction {
    .tool {
      position relative
      .goBack {
        position absolute
        right 5px
        top 0
      }
    }

    .el-button {
      outline: none
    }

    .circle {
      padding 6px 6px;
    }

    .el-row {
      text-align: left;
      margin-bottom: 10px;
    }
    tr {
      th {
        text-align center
      }
    }
  }
</style>
