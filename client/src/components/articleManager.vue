<template>
  <div>
    <div style="margin-bottom: 20px; text-align: left;">
      <el-button type="primary" @click="addData()">新增</el-button>
    </div>
    <el-table :data="lists" border style="width: 100%;">
      <el-table-column
        type="index"
        label="#"
        min-width="10%">
      </el-table-column>
      <el-table-column
        prop="image"
        label="图片"
        min-width="15%" style="overflow: hidden">
        <template slot-scope="scope">
          <img width="100%" height="100%" :src="scope.row.image" alt="">
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
        prop="date"
        label="日期"
        min-width="10%">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="20%">
        <template slot-scope="scope">
          <el-button @click="goShowData(scope.row._id)" size="small">查看</el-button>
          <el-button @click="editData(scope.row._id)" type="primary" size="small">编辑</el-button>
          <el-button @click="removeData(scope.row._id)" type="danger" size="small">删除</el-button>
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
        active  : true,
        username: '',
        lists   : [],
        userId  : ''
      }
    },
    mounted: function () {
      let _this = this;
      if (localStorage.getItem('username')) {
        this.username = JSON.parse(localStorage.getItem('username')).username;
        this.userId = JSON.parse(localStorage.getItem('username'))._id;
        _this.refreshData();
      } else {
        this.$router.push('/login');
      }
    },
    methods: {
      refreshData() {
        this.$http.get('/api/post/get/' + this.userId).then(res => this.lists = res.data);
      },
      addData() {
        this.$router.push('/dataChange/?type=add');
        this.newTitle = '';
      },
      removeData(id) {
        this.$confirm('确定删除这篇文章吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText : '取消',
          type             : 'warning'
        }).then((value) => {
          this.$http.delete('/api/post/remove/' + id)
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
        this.$router.push('/dataChange/?type=edit');
        let canEdit = {
          "editId": id
        };
        localStorage.setItem('canEdit', JSON.stringify(canEdit));
      },
      goShowData(id) {
        this.$router.push('/detail/?id=' + id);
      }
    }
  }
</script>
<style scoped>
</style>
