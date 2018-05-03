<template>
  <div class="dataChange">
    <el-breadcrumb v-if="!isEdit" separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-breadcrumb v-if="isEdit" separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">文章管理</el-breadcrumb-item>
      <el-breadcrumb-item v-show="isEdit">修改文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="articleData" ref="articleData" label-width="70px" class="rowContainer">
      <el-row>
        <el-col :span="6">
          <el-form-item label="标题"
                        prop="newTitle"
                        class="customInput"
                        :rules="validate_rules({required: true})">
            <el-input v-model="articleData.newTitle" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签"
                        prop="tag"
                        class="customInput">
            <el-select v-model="articleData.tagInfo.tagTitle"
                       no-data-text="请先去添加标签"
                       v-on:change="getTagId(articleData.tagInfo.tagTitle)"
                       placeholder="请选择">
              <el-option v-for="tag in tags"
                         :key="tag.title"
                         :label="tag.title"
                         :value="tag.title">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <!--<uploadImage></uploadImage>-->
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="内容"
                      prop="content"
                      :rules="validate_rules({required: true})">
          <mavon-editor :ishljs="true" v-model="articleData.content"></mavon-editor>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item style="text-align: left" label="">
          <el-button type="primary" @click="saveData('articleData')">确定</el-button>
          <el-button type="info" @click="cancelData()">取消</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import uploadImage from './upLoadImage.vue'

  export default {
    name      : 'dataChange',
    data() {
      return {
        type           : this.$route.params.type,
        img            : '',
        isEdit         : false,
        editId         : '',
        userId         : '',
//        imgResult     : '',
//        imgTemplate   : '',
//        imgPath       : '',
        tags           : '',
        articleData : {
          newTitle: '',
          tagInfo : {
            tagTitle: '',
            tagId   : ''
          },
          content : ''
        }
      }
    },
    mounted   : function () {
      if (this.type === 'edit') {
        this.isEdit = true;
        if (localStorage.getItem('canEdit')) {
          this.editId = JSON.parse(localStorage.getItem('canEdit')).editId;
          this.initData();
        }
      }
      this.userId = JSON.parse(localStorage.getItem('userInfo'))._id;
      this.$http.get('api/getTag').then(res => {
        this.tags = res.data.data;
      })
    },
    methods   : {
      initData () {
        this.$http.get(`/api/post/getSinglePost/${this.editId}`).then(res => {
          this.articleData.newTitle = res.data.title;
          this.articleData.content = res.data.content;
//            this.imgPath = res.data.image;
          this.articleData.tagInfo.tagTitle = res.data.tagTitle;
          this.articleData.tagInfo.tagId = res.data.tagId;
        });
      },
      saveData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let displayData = {
//            "image"   : this.imgPath,
              "title"   : this.articleData.newTitle,
              "content" : this.articleData.content,
              "date"    : this.$moment().format('YYYY-MM-DD HH:mm:ss'),
              "tagId"   : this.articleData.tagInfo.tagId,
              "tagTitle": this.articleData.tagInfo.tagTitle
            };
            if (this.type === 'add') {
              this.$http.post(`/api/post/add/${this.userId}`, displayData).then(res => {
                this.$router.push('/admin/articleManager');
                localStorage.removeItem('canAdd');
              })
            } else if (this.type === 'edit') {
              this.isEdit = false;
              this.$http.put(`/api/post/edit/${this.editId}`, displayData)
                .then(res => {
                  this.$router.push("/admin/articleManager");
                  localStorage.removeItem('canEdit');
                });
            }
          } else {
            return false;
          }
        })
      },
      cancelData() {
        if (this.type === 'edit') {
          this.isEdit = false;
        }
        this.articleData.newTitle = '';
        this.$router.push('/admin/articleManager');
        localStorage.removeItem('canAdd');
      },
      imgChange(val) {
//        this.imgPath = val;
      },
      getTagId(title) {
        this.tags.find((tag) => {
          if (tag.title === title) {
            this.articleData.tagInfo.tagId = tag._id;
          }
        })
      }
    },
    components: {
      uploadImage
    }
  }
</script>
<style scoped lang="stylus">
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
    width: 80%;
    text-align: left;
  }

  .rowContainer {
    padding: 20px;
  }

  .customInput {
    width: 80%;
    text-align: left;
  }

</style>
