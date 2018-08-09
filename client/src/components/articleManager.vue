<template>
  <div>
    <el-row>
      <strong>文章管理</strong>
    </el-row>
    <el-row>
      <el-button @click="addData()" type="primary" plain round icon="el-icon-plus" class="circle el-button--small"></el-button>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="lists" border style="width: 100%;">
          <el-table-column
            type="index"
            label="#"
            min-width="10%">
          </el-table-column>
          <el-table-column
            prop="cover"
            label="封面"
            min-width="5%" style="overflow: hidden">
            <template slot-scope="scope">
              <div class="cover" :style="`background-image: url(${scope.row.cover})`"></div>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            min-width="15%">
          </el-table-column>
          <el-table-column
            prop="tagTitle"
            label="标签"
            min-width="5%">
          </el-table-column>
          <el-table-column
            prop="content"
            label="内容"
            min-width="25%"
            class="content">
          </el-table-column>
          <el-table-column
            prop="create_at"
            label="日期"
            min-width="10%">
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="20%">
            <template slot-scope="scope">
              <el-button @click="goShowData(scope.row.id)" type="success" icon="el-icon-view" plain round class="circle"></el-button>
              <el-button @click="editData(scope.row.id)" type="primary" icon="el-icon-edit" plain round class="circle"></el-button>
              <el-button @click="removeData(scope.row.id)" type="danger" icon="el-icon-delete" plain round class="circle"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  export default {
    name   : 'articleManager',
    data() {
      return {
        lists   : [],
        userId  : JSON.parse(localStorage.getItem('currentUser')).id,
        tags    : []
      }
    },
    mounted: function () {
      this.getTag();
      this.refreshData();
    },
    methods: {
      refreshData() {
        this.$http.get(`/api/user/${this.userId}/post`).then(res => {
          this.lists = res.data.data;
          this.lists.find(item => {
            item.create_at = this.$moment(item.create_at).format('YYYY-MM-DD HH:mm:ss');
            item.tagTitle = this.tags.find(tag => {
              return tag.id === item.TagId;
            }).title;
          })
        });
      },
      getTag() {
        this.$http.get(`/api/user/${this.userId}/tag`).then(res => this.tags = res.data.data);
      },
      addData() {
        this.$router.push('/admin/articleManager/add');
      },
      removeData(id) {
        this.$confirm('确定删除这篇文章吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText : '取消',
          type             : 'warning'
        }).then((value) => {
          this.$http.delete(`/api/post/${id}/destroy`)
            .then(() => this.refreshData())
            .then(() => {
              this.$message({
                type   : 'success',
                message: '删除成功！'
              })
            });
        }).catch(() => {
          this.$message({
            type   : 'info',
            message: '已取消删除'
          })
        })
      },
      editData(id) {
        this.$router.push(`/admin/articleManager/edit/${id}`);
      },
      goShowData(id) {
        this.$router.push(`/detail/${id}`);
      }
    }
  }
</script>
<style scoped lang="stylus">
  .el-button.circle
    padding 6px 6px

  .el-button
    outline none

  .el-row
    text-align left
    margin-bottom 10px

  .cover
    width 50px
    height 50px
    margin auto
    background-repeat no-repeat
    background-position center
    -webkit-background-size cover
    background-size cover

</style>
