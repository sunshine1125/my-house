<template>
  <div>
    <el-row>
      <strong>用户管理</strong>
    </el-row>
    <el-row>
      <el-button @click="addUser" type="primary" plain round icon="el-icon-plus" class="circle el-button--small"></el-button>
    </el-row>
    <el-table :data="users" border style="width: 100%;">
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="userType"
        label="用户类型">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="tagTitle"
        label="联系方式">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <!--<el-button @click="editData(scope.row._id)" type="primary" icon="el-icon-edit" plain round class="circle"></el-button>-->
          <el-button @click="removeData(scope.row._id)" type="danger" icon="el-icon-delete" plain round class="circle"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog style="text-align: left" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <user-dialog @isCloseForm="isCloseForm" :formVisible="dialogFormVisible" :editUser="editUser" :canEdit="canEdit"></user-dialog>
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
        users   : [],
        editUser : {},
        canEdit : false,
        userId  : '',
        dialogFormVisible: false,
        dialogTitle: ''
      }
    },
    mounted: function () {
      this.refreshData();
    },
    methods: {
      refreshData() {
        this.$http.get('/api/getAllUsers')
          .then(res => this.users = res.data.data)
          .then(()=> {
            this.users.forEach((item) => {
              if (item.userTypeId === 1) {
                item.userType = '普通用户'
              } else {
                item.userType = '管理员'
              }
            })
          });
      },
//      addData() {
//        this.$router.push('/dataChange/?type=add');
//        this.newTitle = '';
//      },
//      removeData(id) {
//        this.$confirm('确定删除该条记录？', '提示', {
//          confirmButtonText: '确定',
//          cancelButtonText : '取消',
//          type             : 'warning'
//        }).then((value) => {
//          this.$http.delete('/api/post/remove/' + id)
//            .then(() => this.refreshData())
//            .then(() => {
//              this.$message({
//                type   : 'success',
//                message: '删除成功！'
//              })
//            });
//        }).catch(() => {
//          this.$message({
//            type   : 'info',
//            message: '已取消删除'
//          })
//        })
//      },
        editData(id) {
          this.dialogFormVisible = true;
          this.dialogTitle = "编辑用户";
          this.canEdit = true;
//          this.$http.get('/api/getSingleUserById/' + id).then((res) => {
//            this.editUser = res.data.data;
//            if (this.editUser.userTypeId === 1) {
//              this.editUser.userType = '普通用户';
//            } else {
//              this.editUser.userType = '管理员';
//            }
//          })

        },
//      goShowData(id) {
//        this.$router.push('/detail/?id=' + id);
//      },
      addUser() {
        this.dialogFormVisible = true;
        this.dialogTitle = "添加用户";
      },
      isCloseForm(val) {
        this.dialogFormVisible = val;
      }
    },
    components: {
      userDialog
    }
  }
</script>
<style scoped lang="stylus">
  .el-button.circle {
    padding: 6px 6px;
  }

  .el-button {
    outline: none
  }

  .el-row {
    text-align: left;
    margin-bottom: 10px
  }

</style>
