<template>
  <div class="home">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">欢迎 <span>{{username}}</span></a>
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
        <tr v-for="list in lists">
          <td scope="row">{{list.id}}</td>
          <td>{{list.title}}</td>
          <td>{{list.date.substring(0, 10)}}</td>
          <td>
            <button class="btn btn-info" @click="editData(list.id, list.title)">编辑数据</button>
            <button class="btn btn-danger" @click="removeData(list.id)">删除数据</button>
          </td>
        </tr>
        </tbody>
      </table>
      <button class="btn btn-success" @click="addData()">增加数据</button>
      <div class="container" v-show="isDisplay">
        <div class="form-group row">
          <label class="col-sm-2 col-form-label" for="title">Title</label>
          <input class="form-control col-sm-4" type="text" id="title" v-model="newTitle">
          <span class="col-sm-1"></span>
          <button class="btn btn-primary col-sm-1" @click="saveData()">确定</button>
          <span class="col-sm-1"></span>
          <button class="btn btn-secondary col-sm-1" @click="cancelData()">取消</button>
        </div>
      </div>
      <div class="container" v-show="isEdit">
        <div class="form-group row">
          <label class="col-sm-2 col-form-label" for="changeTitle">Title</label>
          <input class="form-control col-sm-4" type="text" id="changeTitle" v-model="changeTitle">
          <span class="col-sm-1"></span>
          <button class="btn btn-primary col-sm-1" @click="sureEdit()">确认修改</button>
          <span class="col-sm-1"></span>
          <button class="btn btn-secondary col-sm-1" @click="cancelEdit()">取消修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import swal from 'sweetalert2'

  export default {
    name   : 'home',
    data() {
      return {
        username   : '',
        lists      : [],
        isDisplay  : false,
        newTitle   : '',
        id         : 0,
        isEdit     : false,
        changeTitle: '',
        editId     : ''
      }
    },
    mounted: function () {
      let _this = this;
      if (localStorage.getItem('username')) {
        this.username = JSON.parse(localStorage.getItem('username')).username;
        _this.refreshData();
      } else {
        this.$router.push('/login');
      }

    },
    methods: {
      refreshData() {
        let _this = this;
        this.$http.get('/api/forms/getData').then(function (res) {
          if (res.data.length > 0) {
            _this.lists = res.data;
            let dataId = res.data[Object.keys(res.data)[Object.keys(res.data).length - 1]].id;
            _this.id = dataId ? parseInt(dataId) + 1 : 0;
          }
        })
      },
      addData() {
        this.isDisplay = true;
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
            let _this = this;
            this.$http.delete('/api/forms/removeData/' + id).then(function () {
              _this.refreshData()
            }).then(function () {
              swal('删除成功！')
            });
          }
        })
      }
      ,
      editData(id) {
        this.isEdit = true;
        this.editId = id;
      }
      ,
      saveData() {
        let _this = this;
        if (this.newTitle) {
          let displayData = {
            "id"   : this.id,
            "title": this.newTitle,
            "date" : new Date().toLocaleDateString(),
          };
          this.lists.push(displayData);
          this.id++;
          this.isDisplay = false;
          this.$http.post('/api/forms/addData', displayData).then(function () {
            _this.refreshData();
          });
        } else {
          swal('Title不能为空！');
        }

      },
      cancelData() {
        this.isDisplay = false;
        this.newTitle = '';
      },
      sureEdit() {
        let _this = this;
        if (this.changeTitle) {
          let changeTitle = {
            title: this.changeTitle
          };
          this.isEdit = false;
          this.$http.put('/api/forms/editData/' + this.editId, changeTitle).then(function () {
            _this.refreshData();
          });
        } else {
          swal('Title不能为空！');
        }

      },
      cancelEdit: function () {
        this.isEdit = false;
        this.changeTitle = '';
      },
      logout    : function () {
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
