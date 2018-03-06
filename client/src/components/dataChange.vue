<template>
  <div class="dataChange">
    <h3 v-show="isDisplay">添加数据</h3>
    <h3 v-show="isEdit">修改数据</h3>
    <div id="table">
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
          <button class="btn btn-primary col-sm-1" @click="sureEdit()">确定</button>
          <span class="col-sm-1"></span>
          <button class="btn btn-secondary col-sm-1" @click="cancelEdit()">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import swal from 'sweetalert2'

  export default {
    name   : 'dataChange',
    data() {
      return {
        isDisplay  : false,
        newTitle   : '',
        isEdit     : false,
        changeTitle: '',
        editId     : '',
        userId     : ''
      }
    },
    mounted: function () {
      if (localStorage.getItem('canAdd')) {
        this.isDisplay = JSON.parse(localStorage.getItem('canAdd')).isDisplay;
      }
      if (localStorage.getItem('canEdit')) {
        this.isEdit = JSON.parse(localStorage.getItem('canEdit')).isEdit;
        this.editId = JSON.parse(localStorage.getItem('canEdit')).id;
      }
      this.userId = JSON.parse(localStorage.getItem('username'))._id;

    },
    methods: {
      saveData() {
        if (this.newTitle) {
          let displayData = {
            "title": this.newTitle,
            "date" : new Date().toLocaleDateString(),
          };
          this.isDisplay = false;
          this.$http.post('/api/post/add/' + this.userId, displayData).then(res => {
            this.$router.push('/');
            localStorage.removeItem('canAdd');
          })
        } else {
          swal('Title不能为空！');
        }
      },
      cancelData() {
        this.isDisplay = false;
        this.newTitle = '';
        this.$router.push('/');
        localStorage.removeItem('canAdd');
      },
      sureEdit() {
        if (this.changeTitle) {
          let payload = {
            title: this.changeTitle
          };
          this.isEdit = false;
          console.log(this.editId);
          this.$http.put('/api/post/edit/' + this.editId, payload)
            .then(res => {
              this.$router.push("/");
              localStorage.removeItem('canEdit');
            });

        } else {
          swal('Title不能为空！');
        }

      },
      cancelEdit: function () {
        this.isEdit = false;
        this.changeTitle = '';
        this.$router.push("/");
        localStorage.removeItem('canEdit');
      }
    }
  }
</script>
<style scoped>
  h3 {
    margin-top: 50px;
  }

  #table {
    width: 56%;
    height: 100%;
    margin: 50px auto;
  }

  .container {
    margin-top: 25px;
  }
</style>
