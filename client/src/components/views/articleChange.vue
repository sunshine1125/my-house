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
        <el-col :span="4" :offset="13">
          <el-button type="text" @click="addTag()">去添加标签 >></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="封面" prop="cover">
            <el-upload
              class="upload-demo"
              action="/api/upload"
              :on-success="handleImgSuccess"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :file-list="fileList"
              list-type="picture"
              :limit="limit">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
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

  export default {
    name      : 'dataChange',
    data() {
      return {
        type       : this.$route.params.type,
        userId     : JSON.parse(localStorage.getItem('currentUser')).id,
        tags       : [],
        postId     : this.$route.params.id,
        edit       : false,
        limit      : 1,
        articleData: {
          title  : '',
          TagId  : '',
          content: '',
          cover  : ''
        },
        fileList : [],
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
            this.fileList.push({
              name: 'cover',
              url: this.articleData.cover
            })
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
          } else {
            return false;
          }
        })
      },
      cancelData() {
        this.$router.push('/admin/articleManager');
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
      },
      handleImgSuccess(res, file) {
        this.articleData.cover = file.response.path;
      },
      handleRemove() {
        this.articleData.cover = '';
      },
      handleExceed(files, fileList) {
        this.$message.warning('只能同时上传一张图片');
      }
    },
    components: {

    }
  }
</script>
<style lang="stylus">
  .dataChange {
    h3 {
      margin-top 30px
    }

    #table {
      width 90%
      height 100%
      margin 20px auto
    }

    .container {
      margin-top 25px
      max-width 100%
    }

    .markdown-body {
      width 100%
      min-height 600px
    }

    .v-note-wrapper.fullscreen {
      width 100%
      height 100%
    }

    .custom-select {
      width 80%
      text-align left
    }

    .rowContainer {
      padding 20px
    }

    .customInput {
      width 80%
      text-align left
    }
    .upload-demo {
      position relative
      .el-upload-list {
        position absolute
        left 25%
        top 0px
        li {
          height auto
          margin-top 0
          paddgin 7px 10px 7px 90px
        }
      }
    }
  }
</style>
