<template>
  <div class="home">
    <el-container>
      <el-header>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <a class="nav-link" href="#">欢迎 <span>{{username}}</span></a>
              </li>
              <li class="nav-item active">
                <a class="nav-link" href="/#/resetPassword">重置密码</a>
              </li>
              <li class="nav-item">
                <a style="cursor: pointer;" class="nav-link" @click="logout()">退出</a>
              </li>
            </ul>
          </div>
        </nav>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!--左侧导航-->
          <div class="main-left">
            <el-menu default-active="/articleManage" class="el-menu-vertical-demo" :router="true">
              <el-menu-item index="/" :class="{'isActive': active}">文章管理</el-menu-item>
              <!--<el-menu-item index="/tagManage" :class="{'isActive': !active}">标签管理</el-menu-item>-->
            </el-menu>
          </div>
        </el-aside>
        <el-main>
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
              min-width="20%">
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
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import swal from 'sweetalert2'

  export default {
    name   : 'index',
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
        swal({
          title            : '确定要删除吗？',
          type             : 'warning',
          showCancelButton : true,
          confirmButtonText: '确定',
          cancelButtonText : '取消'
        }).then((result) => {
          if (result.value) {
            this.$http.delete('/api/post/remove/' + id)
              .then(() => this.refreshData())
              .then(() => swal('删除成功！'));
          }
        })
      },
      editData(id) {
        this.$router.push('/dataChange/?type=edit');
        let canEdit = {
          "editId": id
        };
        localStorage.setItem('canEdit', JSON.stringify(canEdit));
      },
      logout: function () {
        this.$router.push('/login');
        localStorage.removeItem('username');
      },
      goShowData(id) {
        this.$router.push('/detail/?id=' + id);
      }
    }
  }
</script>
<style>
  #table {
    width: 100%;
    height: 100%;
    margin: 10px auto;
  }

  .container {
    margin-top: 25px;
  }
  aside .main-left {
    height: 100%;
  }
  aside .main-left ul {
    height: 100%;
  }

  #navbarSupportedContent ul {
    margin-left: auto !important;
    margin-right: 100px !important;
  }

  .el-table td .cell {
    height: 50px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-table th .cell {
    text-align: center;
  }
</style>
