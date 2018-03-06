<template>
  <div class="home">
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
    <div id="table">
      <table v-show="lists.length>0" class="table table-hover table-bordered">
        <thead class="table-dark">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Title</th>
          <th scope="col">Date</th>
          <th scope="col">Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(list, index) in lists">
          <td scope="row">{{index + 1}}</td>
          <td>{{list.title}}</td>
          <td>{{list.date.substring(0, 10)}}</td>
          <td>
            <button class="btn btn-info" @click="editData(list._id, list.title)">更新数据</button>
            <button class="btn btn-danger" @click="removeData(list._id)">删除数据</button>
          </td>
        </tr>
        </tbody>
      </table>
      <button class="btn btn-success" @click="addData()">增加数据</button>
    </div>
  </div>
</template>

<script>
  import swal from 'sweetalert2'

  export default {
    name   : 'index',
    data() {
      return {
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
        console.log(this.userId)
      } else {
        this.$router.push('/login');
      }
    },
    methods: {
      refreshData() {
        this.$http.get('/api/post/get/' + this.userId).then(res => this.lists = res.data);
      },
      addData() {
        this.$router.push('/dataChange');
        let canAdd = {
          "isDisplay": true
        };
        localStorage.setItem('canAdd', JSON.stringify(canAdd));
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
        this.$router.push('/dataChange');
        let canEdit = {
          "isEdit": true,
          "id"    : id
        };
        localStorage.setItem('canEdit', JSON.stringify(canEdit));
      },
      logout: function () {
        this.$router.push('/login');
        localStorage.removeItem('username');
      }
    }
  }
</script>
<style scoped>
  #table {
    width: 56%;
    height: 100%;
    margin: 50px auto;
  }

  .container {
    margin-top: 25px;
  }

  #navbarSupportedContent ul {
    margin-left: auto !important;
    margin-right: 100px !important;
  }
</style>
