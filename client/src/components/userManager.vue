<template>
  <div>
    <el-row>
      <strong>用户管理</strong>
    </el-row>
    <el-row>
      <el-button @click="addUser" type="primary" plain round icon="el-icon-plus" class="circle el-button--small"></el-button>
    </el-row>
    <el-table :data="lists" border style="width: 100%;">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="title"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="title"
        label="用户类型">
      </el-table-column>
      <el-table-column
        prop="tagTitle"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="tagTitle"
        label="联系方式">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="editData(scope.row._id)" type="primary" icon="el-icon-edit" plain round class="circle"></el-button>
          <el-button @click="removeData(scope.row._id)" type="danger" icon="el-icon-delete" plain round class="circle"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog style="text-align: left" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <user-dialog></user-dialog>
    </el-dialog>
  </div>
</template>

<script>
import userDialog from './userDialog.vue'
  export default {
    name   : 'userManger',
    data() {
      return {
        active  : true,
        username: '',
        lists   : [],
        userId  : '',
        dialogFormVisible: false,
        dialogTitle: ''
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
        this.$confirm('确定删除该条记录？', '提示', {
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
        this.dialogFormVisible = true;
        this.dialogTitle = "编辑用户";
      },
      goShowData(id) {
        this.$router.push('/detail/?id=' + id);
      },
      addUser() {
        this.dialogFormVisible = true;
        this.dialogTitle = "添加用户";
      }
    },
    components: {
      userDialog
    }
  }
</script>
<style scoped>
  .el-button.circle {
    padding: 6px 6px;
  }
  .el-button {
    outline: none;
  }
  .el-row {
    text-align: left;
    margin-bottom: 10px;
  }
</style>
