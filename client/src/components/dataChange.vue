<template>
  <div class="dataChange">
    <el-breadcrumb v-show="isDisplay" separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-breadcrumb v-show="isEdit" separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">文章管理</el-breadcrumb-item>
      <el-breadcrumb-item v-show="isEdit">修改文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form v-show="isDisplay" :model="addArticleData" ref="addArticleData" label-width="70px" class="rowContainer">
      <el-form-item label="标题"
                    prop="newTitle"
                    class="customInput"
                    :rules="validate_rules({required: true})">
        <el-input v-model="addArticleData.newTitle" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="标签"
                    prop="tag"
                    class="customInput">
        <!--<pre>{{addArticleData.tagTitle}}</pre>-->
        <el-select v-model="addArticleData.tagTitle" placeholder="请选择">
          <el-option v-for="tag in tags"
                     :key="tag.title"
                     :label="tag.title"
                     :value="tag.title">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容"
                    prop="content"
                    :rules="validate_rules({required: true})">
        <mavon-editor :ishljs="true" v-model="addArticleData.content"></mavon-editor>
      </el-form-item>
      <el-form-item style="text-align: left" label="">
        <el-button type="primary" @click="saveData('addArticleData')">确定</el-button>
        <el-button type="info" @click="cancelData()">取消</el-button>
      </el-form-item>
    </el-form>
    <el-form v-show="isEdit" :model="editArticleData" ref="editArticleData" label-width="70px" class="rowContainer">
      <el-form-item label="标题"
                    prop="changeTitle"
                    class="customInput">
        <el-input v-model="editArticleData.changeTitle" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="标签"
                    prop="tag"
                    class="customInput">
        <el-select v-model="editArticleData.tagTitle" placeholder="请选择">
          <el-option v-for="tag in tags"
                     :key="tag.title"
                     :label="tag.title"
                     :value="tag.title">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容"
                    prop="content">
        <mavon-editor :ishljs="true" v-model="editArticleData.changeContent"></mavon-editor>
      </el-form-item>
      <el-form-item style="text-align: left" label="">
        <el-button type="primary" @click="sureEdit('editArticleData')">确定</el-button>
        <el-button type="info" @click="cancelEdit()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//  import swal from 'sweetalert2'
//  import uploadImage from './upLoadImage.vue'

  export default {
    name      : 'dataChange',
    data() {
      return {
        isDisplay     : false,
        img           : '',
        isEdit        : false,
        editId        : '',
        userId        : '',
//        imgResult     : '',
//        imgTemplate   : '',
//        imgPath       : '',
        tags          : '',
        addArticleData: {
          newTitle: '',
          tagTitle: '',
          content : ''
        },
        editArticleData: {
          changeTitle  : '',
          tagTitle     : '',
          changeContent: ''
        }
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
            this.editArticleData.changeTitle = res.data.title;
            this.editArticleData.changeContent = res.data.content;
//            this.imgPath = res.data.image;
            this.editArticleData.tagTitle = res.data.tagTitle;
          });
        }
      }
      this.userId = JSON.parse(localStorage.getItem('userInfo'))._id;
      this.$http.get('api/getTag').then(res => {
        this.tags = res.data.data;
      })
    },
    methods   : {
      saveData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let displayData = {
//            "image"   : this.imgPath,
              "title"   : this.addArticleData.newTitle,
              "content" : this.addArticleData.content,
              "date"    : new Date().toLocaleDateString(),
              "tagTitle": this.addArticleData.tagTitle
            };
            this.isDisplay = false;
            this.$http.post('/api/post/add/' + this.userId, displayData).then(res => {
              this.$router.push('/admin/articleManager');
              localStorage.removeItem('canAdd');
            })
          } else {
            return false;
          }
        })
      },
      cancelData() {
        this.isDisplay = false;
        this.addArticleData.newTitle = '';
        this.$router.push('/admin/articleManager');
        localStorage.removeItem('canAdd');
      },
      sureEdit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let payload = {
//            image   : this.imgPath,
              title   : this.editArticleData.changeTitle,
              tagTitle: this.editArticleData.tagTitle,
              content : this.editArticleData.changeContent
            };
            this.isEdit = false;
            this.$http.put('/api/post/edit/' + this.editId, payload)
              .then(res => {
                this.$router.push("/admin/articleManager");
                localStorage.removeItem('canEdit');
              });
          } else {
            return false;
          }
        })

      },
      cancelEdit: function () {
        this.isEdit = false;
        this.editArticleData.changeTitle = '';
        this.$router.push("/admin/articleManager");
        localStorage.removeItem('canEdit');
      },
      imgChange(val) {
//        this.imgPath = val;
      }
    },
    components: {
//      uploadImage
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
    width: 100%;
    min-height: 600px;
  }

  .v-note-wrapper.fullscreen {
    width: 100%;
    height: 100%;
  }

  .custom-select {
    width: 10%;
    text-align: left;
  }

  .rowContainer {
    padding: 20px;
  }

  .customInput {
    width: 40%;
    text-align: left;
  }
</style>
