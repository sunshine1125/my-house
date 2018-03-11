<template>
  <div class="dataChange">
    <h3 v-show="isDisplay">添加数据</h3>
    <h3 v-show="isEdit">修改数据</h3>
    <div id="table">
      <div class="container" v-show="isDisplay">
        <div class="form-group row">
          <label class="col-sm-2 col-form-label" for="title">标题</label>
          <input class="form-control col-sm-4" type="text" id="title" v-model="newTitle">
        </div>
        <uploadImage @imgHasChange="imgChange"></uploadImage>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label">内容</label>
          <mavon-editor :ishljs="true" v-model="content"></mavon-editor>
        </div>
        <div class="form-group row">
          <span class="col-sm-2"></span>
          <button class="btn btn-primary col-sm-1" @click="saveData()">确定</button>
          <span class="col-sm-1"></span>
          <button class="btn btn-secondary col-sm-1" @click="cancelData()">取消</button>
        </div>
      </div>
      <div class="container" v-show="isEdit">
        <div class="form-group row">
          <label class="col-sm-2 col-form-label" for="changeTitle">标题</label>
          <input class="form-control col-sm-4" type="text" id="changeTitle" v-model="changeTitle">
        </div>
        <uploadImage @imgHasChange="imgChange" :imgSrc="imgPath"></uploadImage>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label">内容</label>
          <mavon-editor :ishljs="true" v-model="changeContent"></mavon-editor>
        </div>
        <div class="form-group row">
          <span class="col-sm-2"></span>
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
  import uploadImage from './upLoadImage.vue'

  export default {
    name      : 'dataChange',
    data() {
      return {
        isDisplay    : false,
        newTitle     : '',
        img          : '',
        content      : '',
        changeContent: '',
        isEdit       : false,
        changeTitle  : '',
        editId       : '',
        userId       : '',
        imgResult    : '',
        imgTemplate  : '',
        imgPath      : ''
      }
    },
    mounted   : function () {
      if (this.$route.query.type === 'add') {
        this.isDisplay = true;
      }
      if (this.$route.query.type === 'edit') {
        this.isEdit = true;
        if (localStorage.getItem('canEdit')) {
          this.editId = JSON.parse(localStorage.getItem('canEdit')).editId;
          this.$http.get('/api/post/getSinglePost/' + this.editId).then(res => {
            this.changeTitle = res.data.title;
            this.changeContent = res.data.content;
            this.imgPath = res.data.image;
          });
        }
      }
      this.userId = JSON.parse(localStorage.getItem('username'))._id;
      },
    methods   : {
      saveData() {
        if (this.newTitle) {
          let displayData = {
            "image"  : this.imgPath,
            "title"  : this.newTitle,
            "content": this.content,
            "date"   : new Date().toLocaleDateString()
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
            image  : this.imgPath,
            title  : this.changeTitle,
            content: this.changeContent
          };
          this.isEdit = false;
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
      },
      imgChange (val) {
        this.imgPath = val;
      }
    },
    components: {
      uploadImage
    }
  }
</script>
<style scoped>
  h3 {
    margin-top: 30px;
  }

  #table {
    width: 90%;
    height: 100%;
    margin: 20px auto;
  }

  .container {
    margin-top: 25px;
    max-width: 100%;
  }

  .markdown-body {
    width: 82%;
    min-height: 450px;
  }

  .v-note-wrapper.fullscreen {
    width: 100%;
    height: 100%;
  }
</style>
