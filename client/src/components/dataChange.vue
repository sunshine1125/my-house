<template>
  <div class="dataChange">
    <el-row style="text-align: left">
      <strong v-show="isDisplay">文章管理 / <span>添加文章</span></strong>
      <strong v-show="isEdit">文章管理 / <span>修改文章</span></strong>
    </el-row>
    <el-form v-show="isDisplay" :model="addArticleData" ref="addArticleData" label-width="70px" class="rowContainer">
      <el-form-item label="标题"
                    prop="newTitle"
                    class="customInput"
                    :rules="validate_rules({required: true})">
        <el-input v-model="addArticleData.newTitle" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="标签"
                    prop="tag"
                    class="customInput"
                    :rules="validate_rules({required: true})">
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
      <div class="form-group row">
        <span class="col-sm-2"></span>
        <button class="btn btn-primary col-sm-1" @click="saveData()">确定</button>
        <span class="col-sm-1"></span>
        <button class="btn btn-secondary col-sm-1" @click="cancelData()">取消</button>
      </div>
    </el-form>
    <el-form v-show="isEdit" :model="editArticleData" ref="editArticleData" label-width="70px" class="rowContainer">
      <el-form-item label="标题"
                    prop="changeTitle"
                    class="customInput"
                    :rules="validate_rules({required: true})">
        <el-input v-model="editArticleData.changeTitle" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="标签"
                    prop="tag"
                    class="customInput"
                    :rules="validate_rules({required: true})">
        <el-select v-model="editArticleData.tagTitle" placeholder="请选择">
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
        <mavon-editor :ishljs="true" v-model="editArticleData.changeContent"></mavon-editor>
      </el-form-item>
      <div class="form-group row">
        <span class="col-sm-2"></span>
        <button class="btn btn-primary col-sm-1" @click="sureEdit()">确定</button>
        <span class="col-sm-1"></span>
        <button class="btn btn-secondary col-sm-1" @click="cancelEdit()">取消</button>
      </div>
    </el-form>
    <!--<div id="table">-->
    <!--<div class="container" v-show="isDisplay">-->
    <!--&lt;!&ndash;<div class="form-group row">&ndash;&gt;-->
    <!--&lt;!&ndash;<label class="col-sm-2 col-form-label" for="title">标题</label>&ndash;&gt;-->
    <!--&lt;!&ndash;<input class="form-control col-sm-4" type="text" id="title" v-model="newTitle">&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="form-group row">&ndash;&gt;-->
    <!--&lt;!&ndash;<label class="col-sm-2 col-form-label">标签</label>&ndash;&gt;-->
    <!--&lt;!&ndash;<el-select v-model="tagTitle" placeholder="请选择">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-option v-for="tag in tags"&ndash;&gt;-->
    <!--&lt;!&ndash;:key="tag.title"&ndash;&gt;-->
    <!--&lt;!&ndash;:label="tag.title"&ndash;&gt;-->
    <!--&lt;!&ndash;:value="tag.title">&ndash;&gt;-->
    <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
    <!--&lt;!&ndash;<select class="custom-select" name="" id="" v-model="tagTitle">&ndash;&gt;-->
    <!--&lt;!&ndash;<option v-for="tag in tags" v-model="tag.title">{{tag.title}}</option>&ndash;&gt;-->
    <!--&lt;!&ndash;</select>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<uploadImage @imgHasChange="imgChange"></uploadImage>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="form-group row">&ndash;&gt;-->
    <!--&lt;!&ndash;<label class="col-sm-2 col-form-label">内容</label>&ndash;&gt;-->
    <!--&lt;!&ndash;<mavon-editor :ishljs="true" v-model="content"></mavon-editor>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--<div class="form-group row">-->
    <!--<span class="col-sm-2"></span>-->
    <!--<button class="btn btn-primary col-sm-1" @click="saveData()">确定</button>-->
    <!--<span class="col-sm-1"></span>-->
    <!--<button class="btn btn-secondary col-sm-1" @click="cancelData()">取消</button>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="container" v-show="isEdit">-->
    <!--<div class="form-group row">-->
    <!--<label class="col-sm-2 col-form-label" for="changeTitle">标题</label>-->
    <!--<input class="form-control col-sm-4" type="text" id="changeTitle" v-model="changeTitle">-->
    <!--</div>-->
    <!--<div class="form-group row">-->
    <!--<label class="col-sm-2 col-form-label">标签</label>-->
    <!--<el-select v-model="tagTitle" placeholder="请选择">-->
    <!--<el-option v-for="tag in tags"-->
    <!--:key="tag.title"-->
    <!--:label="tag.title"-->
    <!--:value="tag.title">-->
    <!--</el-option>-->
    <!--</el-select>-->
    <!--&lt;!&ndash;<select class="custom-select" name="" v-model="tagTitle">&ndash;&gt;-->
    <!--&lt;!&ndash;<option v-for="tag in tags" v-model="tag.title">{{tag.title}}</option>&ndash;&gt;-->
    <!--&lt;!&ndash;</select>&ndash;&gt;-->
    <!--</div>-->
    <!--<uploadImage @imgHasChange="imgChange" :imgSrc="imgPath"></uploadImage>-->
    <!--<div class="form-group row">-->
    <!--<label class="col-sm-2 col-form-label">内容</label>-->
    <!--<mavon-editor :ishljs="true" v-model="changeContent"></mavon-editor>-->
    <!--</div>-->
    <!--<div class="form-group row">-->
    <!--<span class="col-sm-2"></span>-->
    <!--<button class="btn btn-primary col-sm-1" @click="sureEdit()">确定</button>-->
    <!--<span class="col-sm-1"></span>-->
    <!--<button class="btn btn-secondary col-sm-1" @click="cancelEdit()">取消</button>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import swal from 'sweetalert2'
  import uploadImage from './upLoadImage.vue'

  export default {
    name      : 'dataChange',
    data() {
      return {
        isDisplay     : false,
        newTitle      : '',
        img           : '',
        content       : '',
        changeContent : '',
        isEdit        : false,
        changeTitle   : '',
        editId        : '',
        userId        : '',
        imgResult     : '',
        imgTemplate   : '',
        imgPath       : '',
        tags          : '',
        tagTitle      : '',
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
      saveData() {
        if (this.newTitle) {
          let displayData = {
//            "image"   : this.imgPath,
            "title"   : this.addArticleData.newTitle,
            "content" : this.addArticleData.content,
            "date"    : new Date().toLocaleDateString(),
            "tagTitle": this.addArticleData.tagTitle
          };
          this.isDisplay = false;
          this.$http.post('/api/post/add/' + this.userId, displayData).then(res => {
            this.$router.push('/articleManager');
            localStorage.removeItem('canAdd');
          })
        } else {
          swal('Title不能为空！');
        }
      },
      cancelData() {
        this.isDisplay = false;
        this.addArticleData.newTitle = '';
        this.$router.push('/articleManager');
        localStorage.removeItem('canAdd');
      },
      sureEdit() {
        if (this.editArticleData.changeTitle) {
          let payload = {
//            image   : this.imgPath,
            title   : this.editArticleData.changeTitle,
            tagTitle: this.editArticleData.tagTitle,
            content : this.editArticleData.changeContent
          };
          this.isEdit = false;
          this.$http.put('/api/post/edit/' + this.editId, payload)
            .then(res => {
              this.$router.push("/articleManager");
              localStorage.removeItem('canEdit');
            });

        } else {
          swal('Title不能为空！');
        }

      },
      cancelEdit: function () {
        this.isEdit = false;
        this.editArticleData.changeTitle = '';
        this.$router.push("/articleManager");
        localStorage.removeItem('canEdit');
      },
      imgChange(val) {
//        this.imgPath = val;
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
