<template>
  <div class="userManager">
    <el-row>
      <strong>用户管理</strong>
    </el-row>
    <el-row class="tool">
      <el-button @click="addUser()" type="primary" plain round icon="el-icon-plus"
                 class="circle el-button--small"></el-button>
    </el-row>
    <el-row style="text-align: center;">
      <el-col :span="24">
        <el-table :data="users" stripe border style="width: 100%;">
          <el-table-column
            prop="id"
            label="Id"
            min-width="5%">
          </el-table-column>
          <el-table-column
            prop="username"
            label="用户名"
            min-width="15%">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            min-width="15%">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            min-width="15%">
          </el-table-column>
          <el-table-column
            prop="admin"
            label="管理员"
            min-width="10%">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.admin" disabled>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="CreatedAt"
            label="创建时间"
            min-width="15%">
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="20%">
            <template slot-scope="scope">
              <el-button @click="editUser(scope.row)" type="primary" icon="el-icon-edit" plain round
                         class="circle"></el-button>
              <el-button @click="removeUser(scope.row.id)" type="danger" icon="el-icon-delete" plain round
                         class="circle"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" style="text-align: left;">
      <el-form :model="userForm" ref="userForm" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username" labelWidth="120px" :rules="validate_rules({required: true})">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" labelWidth="120px" :rules="validate_rules({required: true, type: 'email'})">
          <el-input v-model="userForm.email" :disabled="edit"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" labelWidth="120px">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" labelWidth="120px" :rules="edit ? [] : validate_rules({required: true, type: 'password'})">
          <el-input v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="管理员" labelWidth="120px">
          <el-switch v-model="userForm.admin" :disabled="! currentUser.admin"></el-switch>
        </el-form-item>
        <el-form-item label="" labelWidth="120px">
          <el-button type="primary" @click="save('userForm')">确定</el-button>
          <el-button @click="cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    name   : 'articleManager',
    data() {
      return {
        users            : [],
        currentUser      : JSON.parse(localStorage.getItem('currentUser')),
        userId           : JSON.parse(localStorage.getItem('currentUser')).id,
        dialogFormVisible: false,
        edit             : false,
        userForm         : {
          username: '',
          email   : '',
          phone   : '',
          password: '',
          admin   : false
        }
      }
    },
    mounted: function () {
      this.refreshData();
    },
    methods: {
      refreshData() {
        this.$http.get(`/api/user`).then(res => {
          res.data.user.map(data => {
            data.CreatedAt = this.$moment(data.CreatedAt).format('YYYY-MM-DD hh:mm:ss');
          });
          this.users = res.data.user;
        });
      },
      save(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (!this.edit) {
              this.$http.post('/api/user/register', this.userForm).then(res => {
                if (res.data.success) {
                  this.refreshData();
                  this.$message.success(res.data.msg);
                } else {
                  this.$message.error(res.data.msg);
                }
                this.edit = false;
              });
            } else {
              this.$http.put(`/api/user/${this.userForm.id}`, this.userForm).then((res) => {
                this.refreshData();
                if (this.userForm.id === this.userId) {
                  localStorage.setItem('currentUser', JSON.stringify(this.users.find(u => {
                    return u.id === this.userId;
                  })))
                }
                this.edit = false;
                this.$message({
                  type   : 'success',
                  message: '更新成功'
                })
              });
            }
            this.dialogFormVisible = false;
          } else {
            return false;
          }
        })
      },
      cancel() {
        this.dialogFormVisible = false;
        this.edit = false;
      },
      addUser() {
        if (this.currentUser.admin) {
          this.dialogFormVisible = true;
          this.edit = false;
          this.userForm.username = '';
          this.userForm.email = '';
          this.userForm.phone = '';
          this.userForm.password = '';
          this.userForm.admin = false;
        } else {
          this.$message.error('您没有操作权限，请联系管理员！')
        }
      },
      editUser(user) {
        if (this.currentUser.admin) {
          this.dialogFormVisible = true;
          this.edit = true;
          this.userForm = user;
        } else {
          this.$message.error('您没有操作权限，请联系管理员！')
        }
      },
      removeUser(id) {
        if (this.currentUser.admin) {
          this.$confirm('确定删除该用户？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText : '取消',
            type             : 'warning'
          }).then(() => {
            this.$http.delete(`/api/user/${id}`).then((res) => {
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
          this.$message.error('您没有操作权限，请联系管理员！')
        }
      }
    }
  }
</script>
<style lang="stylus">
  .userManager {
    .avatar {
      width 50px
      height 50px
      margin auto
      background-repeat no-repeat
      background-position center
      -webkit-background-size cover
      background-size cover
    }
  }
</style>
