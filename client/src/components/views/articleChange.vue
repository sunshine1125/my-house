<template>
  <div class="dataChange">
    <el-breadcrumb v-if="type === 'add'" separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-breadcrumb v-if="type === 'edit'" separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="articleData" :rules="rules" ref="articleData" label-width="70px" class="rowContainer">
      <el-row>
        <el-col>
          <el-form-item label="标题"
                        prop="title"
                        class="customInput">
            <el-input v-model="articleData.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="标签"
                        prop="TagId"
                        class="customInput">
            <el-select v-model="articleData.TagId"
                       no-data-text="请先去添加标签"
                       placeholder="请选择标签">
              <el-option v-for="tag in tags"
                         :key="tag.title"
                         :label="tag.title"
                         :value="tag.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <upload-image @imgSrc="getImgUrl" :imgPath="articleData.cover" :edit="edit"></upload-image>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="5">
          <el-button type="text" @click="addTag()">去添加标签 >></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="内容"
                      prop="content">
          <mavon-editor ref=md @imgAdd="$imgAdd" :ishljs="true" v-model="articleData.content"></mavon-editor>
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
  import uploadImage from '../upLoadImage.vue'

  export default {
    name      : 'dataChange',
    data() {
      return {
        type       : this.$route.params.type,
        userId     : JSON.parse(localStorage.getItem('currentUser')).id,
        tags       : [],
        postId     : this.$route.params.id,
        edit       : false,
        articleData: {
          title  : '',
          TagId  : '',
          content: '',
          cover  : ''
        },
        rules      : {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          TagId: [
            {required: true, message: '请选择标签', trigger: 'blur'}
          ],
          cover: [
            {required: true, message: '请上传文章封面', trigger: 'blur'}
          ],
          content : [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ]
        }
      }
    },
    mounted   : function () {
      this.getTagList();
      if (this.type === 'edit' && this.postId) {
        this.initData();
        this.edit = true;
      } else if (this.type === 'add') {
          this.edit = false;
          this.$router.push('/admin/articleManager/add');
      } else {
        this.articleData.content = null;
        this.edit = false;
        window.location.reload();
        this.$router.push('/404');
      }
    },
    methods   : {
      initData() {
        this.$http.get(`/api/post/${this.postId}/true`).then(res => {
          if (res.data.success) {
            this.articleData = res.data.data;
          } else if (res.data.notFound) {
            this.$router.push('/404');
          }
        });
      },
      getTagList() {
        this.$http.get(`/api/tag`).then(res => this.tags = res.data.data);
      },
      addTag() {
        this.$router.push('/admin/tagManager');
      },
      saveData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (! this.articleData.cover) {
              this.$alert('请上传文章封面', '警告', {
                confirmButtonText: '确定'
              });
            } else {
              this.articleData.create_at = this.$moment().format('YYYY-MM-DD HH:mm:ss');
              if (this.type === 'add') {
                this.$http.post(`/api/user/${this.userId}/post/create`, this.articleData).then(res => {
                  if (res.data.success) {
                    this.$router.push('/admin/articleManager');
                  }
                })
              } else {
                this.$http.put(`/api/post/${this.postId}/update`, this.articleData)
                  .then(res => {
                    if (res.data.success) {
                      this.$router.push("/admin/articleManager");
                    }
                  });
              }
            }
          } else {
            return false;
          }
        })
      },
      cancelData() {
        this.$router.push('/admin/articleManager');
      },
      getImgUrl(val) {
        this.articleData.cover = val;
      },
      $imgAdd(pos, $file) {
        let fd = new FormData();
        fd.append('file', $file);
        this.$http.post('/api/upload', fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          this.$refs.md.$img2Url(pos, res.data.path);
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
